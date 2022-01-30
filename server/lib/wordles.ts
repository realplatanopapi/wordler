import {
  User,
  Wordle,
  WordleResult,
} from '@prisma/client'
import db from '@server/services/db'
import {Prisma } from '@prisma/client'
import { addDays } from 'date-fns'
import { getToday, startOfDay, toUTC } from '@common/utils/time'
import { getById } from './accounts'

export async function getOrCreateWordle(number: number): Promise<Wordle> {
  const existingWordle = await db.wordle.findFirst({
    where: {
      number,
    },
  })
  if (existingWordle) {
    return existingWordle
  }

  return await db.wordle.create({
    data: {
      number,
      date: startOfDay(toUTC(new Date())),
    },
  })
}

export enum WordleGuessResult {
  EXACT_MATCH = "EXACT_MATCH",
  IN_WORD = "IN_WORD",
  NOT_IN_WORD = "NOT_IN_WORD"
}

interface ResultData {
  wordleNumber: number
  attempts: WordleGuessResult[][]
  didSolve: boolean
  attemptsUsed: number
  maxAttempts: number
}

export async function addResultsForUser(user: User, resultsString: string) {
  const resultData = parseResultsFromString(resultsString)
  const score = calculateScore(resultData)
  const wordle = await getOrCreateWordle(resultData.wordleNumber)

  return await db.wordleResult.create({
    data: {
      wordleId: wordle.id,
      userId: user.id,
      attemptsUsed: resultData.attemptsUsed,
      maxAttempts: resultData.maxAttempts,
      guesses: resultData.attempts,
      didSolve: resultData.didSolve,
      score: score,
    },
  })
}

function calculateScore(data: ResultData) {
  if (!data.didSolve) {
    return 0
  }

  return ((data.maxAttempts - data.attemptsUsed) * 100) + 100
}

function parseResultsFromString(resultsString: string): ResultData {
  const lines = resultsString.trim().split('\n')
  const header = lines[0].trim()
  const attempts = lines.slice(2)

  const headerParts = header.split(' ')
  const wordleNumber = parseInt(headerParts[1])

  const attemptsParts = headerParts[2].split('/')
  const attemptsUsedStr = attemptsParts[0]
  const maxAttempts = parseInt(attemptsParts[1])
  let attemptsUsed = parseInt(attemptsUsedStr)
  if (isNaN(attemptsUsed)) {
    attemptsUsed = maxAttempts
  }

  const parsedAttempts = attempts.map((attempt) => {
    const guesses = Array.from(attempt.trim())
    return guesses.map((guess) => {
      if (guess == '🟩') {
        return WordleGuessResult.EXACT_MATCH
      } else if (guess == '🟨') {
        return WordleGuessResult.IN_WORD
      } else {
        return WordleGuessResult.NOT_IN_WORD
      }
    })
  })

  return {
    wordleNumber,
    attempts: parsedAttempts,
    didSolve: true,
    maxAttempts: maxAttempts,
    attemptsUsed,
  }
}

interface ResultQueryOptions {
  take: number
  cursor?: string | null
  userId?: string
  groupId?: string
  from: Date
  until: Date
}

interface ResultsQueryResult {
  total: number
  nextCursor: string | null
  data: WordleResult[]
}

export async function queryResults({
  userId,
  from,
  until,
  ...options
}: ResultQueryOptions): Promise<ResultsQueryResult> {
  const where: Prisma.WordleResultWhereInput = {
    AND: [
      {
        wordle: {
          date: {
            gte: startOfDay(from),
            lt: addDays(
              startOfDay(until)
            , 1),
          }
        }
      },
      {
        OR: [
          {
            userId: userId
          },
          {
            user: {
              groupMemberships: {
                some: {
                  groupId: options.groupId,
                  userId: userId
                }
              }
            }
          }
        ]
      }
    ]
  }

  const total = await db.wordleResult.count({
    where
  })

  const data = await db.wordleResult.findMany({
    skip: options.cursor ? 1 : undefined,
    cursor: options.cursor ? {
      id: options.cursor
    } : undefined,
    orderBy: {
      createdAt: 'desc'
    },
    where,
  })

  return {
    total,
    data, 
    nextCursor: data.length > 0 ? data[data.length - 1].id : null
  }
}

export async function canPostResults(user: User): Promise<boolean> {
  const today = getToday()
  const count = await db.wordleResult.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: today,
        lt: addDays(today, 1)
      }
    }
  })

  return count === 0
}

export interface LeaderboardEntry {
  user: User
  score: number
}

export interface Leaderboard {
  entries: LeaderboardEntry[]
}

export async function getLeaderboard(): Promise<Leaderboard> {
  const results = await db.wordleResult.groupBy({
    by: ['userId'],
    _sum: {
      score: true
    },
    orderBy: {
      _sum: {
        score: 'desc'
      }
    },
  })

  const entries = await Promise.all(
    results.map(async result => {
      const user = await getById(result.userId) as User
      const score = result._sum.score as number

      return {
        user,
        score
      }
    })
  )

  return {
    entries
  }
}
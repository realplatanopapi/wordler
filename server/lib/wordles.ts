import { User, Wordle, WordleResult } from '@prisma/client'
import db from '@server/services/db'
import { Prisma } from '@prisma/client'
import { startOfDay, subMinutes } from 'date-fns'
import { getById } from './accounts'
import { ErrorWithCode } from '@server/errors';
import { INVALID_WORDLE, NOT_AUTHORIZED } from '@server/errors/codes'

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
    },
  })
}

export enum WordleGuessResult {
  EXACT_MATCH = 'EXACT_MATCH',
  IN_WORD = 'IN_WORD',
  NOT_IN_WORD = 'NOT_IN_WORD',
}

interface ResultData {
  wordleNumber: number
  attempts: WordleGuessResult[][]
  didSolve: boolean
  attemptsUsed: number
  maxAttempts: number
}

export async function addResultsForUser(user: User, resultsString: string) {
  if (!canPostResults(user)) {
    throw new ErrorWithCode(NOT_AUTHORIZED)
  }
  
  let resultData: ResultData | null = null
  try {
    resultData = parseResultsFromString(resultsString)
  } catch (error) {
    throw new ErrorWithCode(INVALID_WORDLE)
  }
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

  return (data.maxAttempts - data.attemptsUsed) * 100 + 100
}

function parseResultsFromString(resultsString: string): ResultData {
  const lines = resultsString.trim().split('\n')
  const attempts = lines.slice(2)

  // TODO: clean up this validation
  if (attempts.length > 6) {
    throw new ErrorWithCode(INVALID_WORDLE)
  }

  const header = lines[0].trim()
  const headerParts = header.split(' ')
  if (headerParts.length !== 3) {
    throw new ErrorWithCode(INVALID_WORDLE)
  }
  const wordleNumber = parseInt(headerParts[1])

  const attemptsParts = headerParts[2].split('/')
  const attemptsUsedStr = attemptsParts[0]
  const maxAttempts = parseInt(attemptsParts[1])
  let attemptsUsed = parseInt(attemptsUsedStr)
  if (isNaN(attemptsUsed) && isNaN(maxAttempts)) {
    throw new ErrorWithCode(INVALID_WORDLE)
  }

  if (isNaN(attemptsUsed)) {
    attemptsUsed = maxAttempts
  }

  if (attempts.length !== attemptsUsed) {
    throw new ErrorWithCode(INVALID_WORDLE)
  }

  const parsedAttempts = attempts.map((attempt) => {
    const guesses = Array.from(attempt.trim())
    return guesses.map((guess) => {
      if (guess == '🟩') {
        return WordleGuessResult.EXACT_MATCH
      } else if (guess == '🟨') {
        return WordleGuessResult.IN_WORD
      } else if (guess == '⬛') {
        return WordleGuessResult.NOT_IN_WORD
      } else {
        throw new ErrorWithCode(INVALID_WORDLE)
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
  groupId,
  userId,
  from,
  until,
  ...options
}: ResultQueryOptions): Promise<ResultsQueryResult> {
  const where = buildResultsFilter({
    from,
    until,
    groupId,
    userId
  })

  const total = await db.wordleResult.count({
    where,
  })

  const data = await db.wordleResult.findMany({
    skip: options.cursor ? 1 : undefined,
    cursor: options.cursor
      ? {
          id: options.cursor,
        }
      : undefined,
    orderBy: {
      createdAt: 'desc',
    },
    where,
  })

  return {
    total,
    data,
    nextCursor: data.length > 0 ? data[data.length - 1].id : null,
  }
}

export async function canPostResults(user: User, timezoneOffset?: number): Promise<boolean> {
  // If no offset is supplied, restrict user to a max of 2 results per day
  if (!timezoneOffset) {
    const now = new Date()
    const count = await db.wordleResult.count({
      where: {
        userId: user.id,
        createdAt: {
          lte: now,
        },
      },
    })
  
    return count < 2
  }

  const localTime = subMinutes(new Date(), timezoneOffset)
  const start = startOfDay(localTime)

  const count = await db.wordleResult.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: start,
      },
    },
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

export interface LeaderboardQueryOptions {
  from: Date
  until: Date
  userId?: string
  groupId?: string
}

export async function getLeaderboard(
  {
    from,
    until,
    userId,
    groupId
  }: LeaderboardQueryOptions
): Promise<Leaderboard> {
  const results = await db.wordleResult.groupBy({
    by: ['userId'],
    _sum: {
      score: true,
    },
    where: buildResultsFilter({
      from,
      until,
      userId,
      groupId,
    }),
    orderBy: {
      _sum: {
        score: 'desc',
      },
    },
  })

  const entries = await Promise.all(
    results.map(async (result) => {
      const user = (await getById(result.userId)) as User
      const score = result._sum.score as number

      return {
        user,
        score,
      }
    })
  )

  return {
    entries,
  }
}

interface ResultsFilterOptions {
  from: Date
  until: Date
  userId?: string
  groupId?: string
}

function buildResultsFilter({
  from,
  until,
  userId,
  groupId,
}: ResultsFilterOptions): Prisma.WordleResultWhereInput {
  return {
    AND: [
      {
        createdAt: {
          gte: from,
          lte: until,
        },
      },
      {
        OR: [
          {
            userId: userId,
          },
          {
            user: {
              groupMemberships: {
                some: {
                  group: {
                    memberships: {
                      every: {
                        groupId
                      },
                      some: {
                        userId
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }     
    ]
  }
}
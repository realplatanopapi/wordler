import {
  Group,
  User,
  Wordle,
  WordleAttempt,
  WordleGuessResult,
  WordleResult,
} from '@prisma/client'
import db from '@server/services/db'
import {Prisma } from '@prisma/client'
import { startOfDay } from 'date-fns'

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
      date: startOfDay(new Date()),
    },
  })
}

interface ResultData {
  wordleNumber: number
  attempts: WordleGuessResult[][]
}

export async function addResultsForUser(user: User, resultsString: string) {
  const resultData = parseResultsFromString(resultsString)
  const wordle = await getOrCreateWordle(resultData.wordleNumber)

  return await db.wordleResult.create({
    data: {
      wordleId: wordle.id,
      userId: user.id,
      attempts: {
        create: resultData.attempts.map((attempt) => {
          return {
            guesses: attempt,
          }
        }),
      },
    },
    include: {
      attempts: true,
      wordle: true,
    },
  })
}

function parseResultsFromString(resultsString: string): ResultData {
  const lines = resultsString.trim().split('\n')
  const header = lines[0].trim()
  const attempts = lines.slice(2)

  const headerParts = header.split(' ')
  const wordleNumber = parseInt(headerParts[1])

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
  }
}

interface ResultQueryOptions {
  take: number
  cursor?: string | null
  userId?: string
  groupId?: string
  date?: Date
}

interface ResultsQueryResult {
  total: number
  nextCursor: string
  data: (WordleResult & {
    user: User,
    attempts: WordleAttempt[],
    wordle: Wordle
  })[]
}

export async function queryResults({
  userId,
  date,
  ...options
}: ResultQueryOptions): Promise<ResultsQueryResult> {
  const where: Prisma.WordleResultWhereInput = {
    OR: [
      {
        userId: userId
      },
      {
        createdAt: date ? {
          gte: date,
          lt: date
        } : undefined,
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

  const total = await db.wordleResult.count({
    where
  })

  const data = await db.wordleResult.findMany({
    skip: options.cursor ? 1 : undefined,
    cursor: options.cursor ? {
      id: options.cursor
    } : undefined,
    include: {
      user: true,
      attempts: true,
      wordle: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    where,
  })

  return {
    total,
    data, 
    nextCursor: data[data.length - 1].id
  }
}

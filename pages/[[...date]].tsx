import WordleResult from '@client/components/WordleResult'
import { getGroupsForUser } from '@server/lib/groups'
import { hasPostedResultsToday, queryResults } from '@server/lib/wordles'
import axios from 'axios'
import { addDays, subDays } from 'date-fns'
import { withIronSessionSsr } from 'iron-session/next'
import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Box, Heading, Link, Text } from 'theme-ui'
import { getById } from '../server/lib/accounts'
import { cookieConfig } from '@server/lib/auth'
import { startOfDay, toUTC } from '@common/utils/time'
import format from 'date-fns/format'
import DatePicker from '@client/components/DatePicker'

interface HomePageProps {
  user: any
  hasPostedResultsToday: boolean
  wordleResults: any[]
  groups: any[]
  date: string
  [key: string]: any
}

export const getServerSideProps = withIronSessionSsr<HomePageProps>(
  async ({ req, query }) => {
    const dateQuery = query.date as string | undefined
    const today = startOfDay(toUTC(new Date()))
    const date = dateQuery ? startOfDay(toUTC(new Date(dateQuery))) : today

    const userId = req.session.userId
    if (!userId) {
      return {
        props: {
          hasPostedResultsToday: false,
          date: date.toISOString(),
          user: null,
          wordleResults: [],
          groups: [],
        },
      }
    }

    const user = await getById(userId)
    if (!user) {
      return {
        props: {
          hasPostedResultsToday: false,
          date: date.toISOString(),
          user: null,
          wordleResults: [],
          groups: [],
        },
      }
    }

    const groups = await getGroupsForUser(user)
    const { data: results } = await queryResults({
      userId: user.id,
      take: 25,
      date,
    })

    return {
      props: {
        date: date.toISOString(),
        hasPostedResultsToday: await hasPostedResultsToday(user),
        user: {
          displayName: user.displayName,
        },
        wordleResults: results.map((result) => {
          return {
            id: result.id,
            user: {
              id: result.user.id,
              displayName: result.user.displayName,
            },
            attempts: result.attempts.map((attempt) => {
              return {
                guesses: attempt.guesses,
              }
            }),
            createdAt: result.createdAt.toISOString(),
          }
        }),
        groups: groups.map((group) => {
          return {
            id: group.id,
            name: group.name,
            slug: group.slug,
          }
        }),
      },
    }
  },
  cookieConfig
)

const Home: NextPage<HomePageProps> = ({
  hasPostedResultsToday,
  user,
  wordleResults: initialWordleResults,
  groups,
  date,
}) => {
  const [wordleResults, setWordleResults] = useState(initialWordleResults)
  const router = useRouter()

  if (user) {
    return (
      <>
        <Head>
          <title>Wordler</title>
        </Head>
        <Box mb={3}>
          <Heading as="h1">Wordler</Heading>
          <Text as="p">
            Signed in as <strong>@{user.displayName}</strong>.
          </Text>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <Text as="p">
            <Link href="/api/auth/logout">Sign out</Link>
          </Text>
        </Box>
        <Box mb={5}>
          <Heading mb={2} as="h2">
            activity
          </Heading>
          <DatePicker selectedDate={startOfDay(toUTC(new Date(date)))} />
          {wordleResults.map((result: any) => {
            return (
              <Box key={result.id} mb={3}>
                <WordleResult result={result} />
              </Box>
            )
          })}
        </Box>
        {!hasPostedResultsToday && (
          <Box mb={5}>
            <Heading as="h2">post your results</Heading>
            <form
              onSubmit={async (event) => {
                event.preventDefault()
                const form = event.target as HTMLFormElement
                const data = new FormData(form)
                const result = await axios.post('/api/results', {
                  results: data.get('results'),
                })
                setWordleResults([result.data.data].concat(wordleResults))
                form.reset()
              }}
            >
              <textarea
                name="results"
                placeholder="Paste results from Wordle here"
                required
                style={{
                  height: 100,
                  width: 300,
                }}
              ></textarea>
              <br />
              <button type="submit">Post</button>
            </form>
          </Box>
        )}
        <Box mb={5}>
          <Heading as="h2">groups</Heading>
          {groups.length ? (
            groups.map((group) => {
              return (
                <NextLink key={group.id} href={`/groups/${group.slug}`}>
                  <Link href={`/groups/${group.slug}`}>{group.name}</Link>
                </NextLink>
              )
            })
          ) : (
            <Text>Not a member of any groups (yet)</Text>
          )}
          <form
            onSubmit={async (event) => {
              event.preventDefault()
              const form = event.target as HTMLFormElement
              const data = new FormData(form)
              const result = await axios.post('/api/groups', {
                name: data.get('name'),
              })
              router.push(`/groups/${result.data.data.id}`)
            }}
          >
            <label>
              <span>start a group</span>
              <br />
              <input name="name" placeholder="name your group" required />
            </label>
            <button type="submit">start</button>
          </form>
        </Box>
      </>
    )
  }

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/twitter/authorize">Sign in with Twitter</a>
    </div>
  )
}

export default Home

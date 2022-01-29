import WordleResult from '@client/components/WordleResult'
import { getGroupsForUser } from '@server/lib/groups'
import { hasPostedResultsToday, queryResults } from '@server/lib/wordles'
import axios from 'axios'
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
import DatePicker from '@client/components/DatePicker'
import { useResultsQuery } from './__gql__/results'

interface HomePageProps {
  user: any | null
  date: string
  hasPostedResultsToday: boolean
  groups: any[]
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
          groups: [],
        },
      }
    }

    const groups = await getGroupsForUser(user)

    return {
      props: {
        date: date.toISOString(),
        hasPostedResultsToday: await hasPostedResultsToday(user),
        user: {
          id: user.id,
          displayName: user.displayName,
        },
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
  date,
  hasPostedResultsToday,
  user,
  groups,
}) => {
  const router = useRouter()
  const resultsQuery = useResultsQuery({
    variables: {
      date
    }
  })
  const results = resultsQuery.data?.results

  if (user) {
    return (
      <>
        <Head>
          <title>Wordler</title>
        </Head>
        <Box mb={3}>
          <Heading as="h1">Wordler</Heading>
        </Box>
        <Box mb={5}>
          <DatePicker selectedDate={startOfDay(toUTC(new Date(date)))} />
          {results?.map((result: any) => {
            return (
              <Box key={result.id} mb={3}>
                <WordleResult currentUser={user} result={result} />
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

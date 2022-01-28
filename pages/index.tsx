import WordleResult from '@client/components/WordleResult'
import { getGroupsForUser } from '@server/lib/groups'
import { getResultsForUser } from '@server/lib/wordles'
import axios from 'axios'
import { withIronSessionSsr } from 'iron-session/next'
import type { NextPage } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Box, Heading, Link, Text } from 'theme-ui'
import { getById } from '../server/lib/accounts'
import { cookieConfig } from '../server/lib/auth'
interface HomePageProps {
  user: any
  wordleResults: any[]
  groups: any[]
  [key: string]: any
}

export const getServerSideProps = withIronSessionSsr<HomePageProps>(
  async ({ req }) => {
    const userId = req.session.userId
    if (!userId) {
      return {
        props: {
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
          user: null,
          wordleResults: [],
          groups: [],
        },
      }
    }

    const groups = await getGroupsForUser(user)
    const results = await getResultsForUser(user)

    return {
      props: {
        user: {
          displayName: user.displayName,
        },
        wordleResults: results.map((result) => {
          return {
            id: result.id,
            attempts: result.attempts.map((attempt) => {
              return {
                guesses: attempt.guesses,
              }
            }),
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
  user,
  wordleResults: initialWordleResults,
  groups,
}) => {
  const [wordleResults, setWordleResults] = useState(initialWordleResults)
  const router = useRouter()

  if (user) {
    return (
      <>
        <Box mb={4}>
          <Heading as="h1">Wordler</Heading>
          <Text as="p">
            Signed in as <strong>@{user.displayName}</strong>.
          </Text>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <Text as="p">
            <Link href="/api/auth/logout">Sign out</Link>
          </Text>
        </Box>
        <Box mb={4}>
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
        <Box mb={4}>
          <Heading as="h2">your results</Heading>
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
                height: 369,
                width: 420,
              }}
            ></textarea>
            <button type="submit">Save</button>
          </form>
          {wordleResults.map((result: any) => {
            return <WordleResult key={result.id} result={result} />
          })}
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

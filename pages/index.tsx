import WordleResult from '@client/components/WordleResult'
import { getGroupsForUser } from '@server/lib/groups'
import { getResultsForUser } from '@server/lib/wordles'
import axios from 'axios'
import { withIronSessionSsr } from 'iron-session/next'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Text } from 'theme-ui'
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
      <div>
        <Text>Signed in as {user.displayName}</Text>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/logout">Sign out</a>
        <h2>groups</h2>
        {groups.length ? (
          groups.map((group) => {
            return (
              <Link key={group.id} href={`/groups/${group.slug}`}>
                {group.name}
              </Link>
            )
          })
        ) : (
          <p>Not a member of any groups (yet)</p>
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
        <h2>your results</h2>
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
      </div>
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

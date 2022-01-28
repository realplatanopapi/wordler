import { User } from '@prisma/client';
import { getResultsForUser } from '@server/lib/wordles';
import { withIronSessionSsr } from 'iron-session/next';
import type { NextPage } from 'next'
import { getById } from '../server/lib/accounts';
import { cookieConfig } from '../server/lib/auth';

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const userId = req.session.userId
    if (!userId) {
      return {
        props: {
          user: null
        }
      };
    }

    const user = await getById(userId)
    if (!user) {
      return {
        props: {
          user: null
        }
      }
    }

    return {
      props: {
        user: {
          displayName: user.displayName
        },
        wordleResults: (await getResultsForUser(user)).map(result => {
          return {
            attempts: result.attempts.map(attempt => {
              return {
                guesses: attempt.guesses
              }
            })
          }
        })
      },
    };
  },
  cookieConfig
);

const Home: NextPage = ({
  user,
  wordleResults,
}: {
  user: Pick<User, 'displayName'>
}) => {
  if (user) {
    return (
      <div>
        <p>Signed in as {user.displayName}</p>
        { /* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/logout">Sign out</a>
        {
          JSON.stringify(wordleResults)
        }
      </div>
    )
  }

  return (
    <div>
      { /* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/twitter/authorize">Sign in with Twitter</a>
    </div>
  )
}

export default Home

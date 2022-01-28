import WordleResult from '@client/components/WordleResult'
import { cookieConfig } from '@server/lib/auth'
import { getGroupById, getGroupBySlug, getGroupInviteCode } from '@server/lib/groups'
import { getResultsForGroup } from '@server/lib/wordles'
import { withIronSessionSsr } from 'iron-session/next'
import { NextPage } from 'next'
import config from '@server/config'

interface Props {
  group: {
    id: string
    name: string
    inviteCode: string | null
  }
  results: any[]
  appUrl: string
  [key: string]: any
}

export const getServerSideProps = withIronSessionSsr<Props>(
  async ({ req, params = {} }) => {
    const group = await getGroupBySlug(params.groupSlug as string)
    if (!group) {
      return {
        notFound: true,
      }
    }

    const results = await getResultsForGroup(group)
    const inviteCode = await getGroupInviteCode(group)

    return {
      props: {
        appUrl: config.get('appUrl'),
        group: {
          id: group.id,
          name: group.name,
          slug: group.slug,
          inviteCode: inviteCode?.code || null,
        },
        results: results.map((result) => {
          return {
            id: result.id,
            attempts: result.attempts.map((attempt) => {
              return {
                id: attempt.id,
                guesses: attempt.guesses,
              }
            }),
            user: {
              id: result.user.id,
              displayName: result.user.displayName,
            },
          }
        }),
      },
    }
  },
  cookieConfig
)

const GroupPage: NextPage<Props> = ({ appUrl, group, results }) => {
  return (
    <div>
      <h1>{group.name}</h1>
      <p>
        Send others this url to have them join your group:{' '}
        <em>
          {appUrl}/accept-invite?inviteCode={group.inviteCode}
        </em>
      </p>
      {results.map((result: any) => {
        return (
          <div key={result.id}>
            <p>{result.user.displayName}</p>
            <WordleResult result={result} />
          </div>
        )
      })}
    </div>
  )
}

export default GroupPage

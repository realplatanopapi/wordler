import WordleResult from '@client/components/WordleResult'
import { cookieConfig } from '@server/lib/auth'
import { getGroupBySlug, getGroupInviteCode } from '@server/lib/groups'
import { queryResults } from '@server/lib/wordles'
import { withIronSessionSsr } from 'iron-session/next'
import { NextPage } from 'next'
import config from '@server/config'
import { Heading, Text } from 'theme-ui'
import Head from 'next/head'
import { getById } from '@server/lib/accounts'

interface Props {
  user: {
    id: string
  } | null,
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

    const {data: results} = await queryResults({
      groupId: group.id,
      take: 25,
    })
    const inviteCode = await getGroupInviteCode(group)
    const user = req.session.userId ? await getById(req.session.userId) : null

    return {
      props: {
        appUrl: config.get('appUrl'),
        user: user ? {
          id: user.id
        } : null,
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
            createdAt: result.createdAt.toISOString()
          }
        }),
      },
    }
  },
  cookieConfig
)

const GroupPage: NextPage<Props> = ({ appUrl, group, results, user }) => {
  return (
    <>
      <Head>
        <title>{group.name}</title>
      </Head>
      <Heading>{group.name}</Heading>
      <Text as="p">
        Send others this url to have them join your group:{' '}
        <em>
          {appUrl}/accept-invite?inviteCode={group.inviteCode}
        </em>
      </Text>
      {results.map((result: any) => {
        return (
          <WordleResult currentUser={user} key={result.id} result={result} />
        )
      })}
    </>
  )
}

export default GroupPage

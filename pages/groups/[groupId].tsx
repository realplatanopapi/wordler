import WordleResult from "@client/components/WordleResult"
import { cookieConfig } from "@server/lib/auth"
import { getGroupById } from "@server/lib/groups"
import { getResultsForGroup } from "@server/lib/wordles"
import { withIronSessionSsr } from "iron-session/next"
import { NextPage } from "next"

interface Props {
  group: {
    name: string
  }
  results: any[]
  [key: string]: any
}

export const getServerSideProps = withIronSessionSsr<Props>(
  async ({req, params = {}}) => {
    const group = await getGroupById(params.groupId as string)
    if (!group) {
      return {
        notFound: true
      }
    }

    const results = await getResultsForGroup(group)

    return {
      props: {
        group: {
          name: group.name
        },
        results: results.map(result => {
          return {
            id: result.id,
            attempts: result.attempts.map(attempt => {
              return {
                id: attempt.id,
                guesses: attempt.guesses
              }
            }),
            user: {
              id: result.user.id,
              displayName: result.user.displayName,
            }
          }
        }),
      }
    }
  },
  cookieConfig
)

const GroupPage: NextPage<Props> = ({
  group,
  results
}) => {
  return (
    <div>
      <h1>{group.name}</h1>
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

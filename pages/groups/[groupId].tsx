import { cookieConfig } from "@server/lib/auth"
import { getGroupById } from "@server/lib/groups"
import { withIronSessionSsr } from "iron-session/next"
import { NextPage } from "next"

interface Props {
  group: {
    name: string
  }
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

    return {
      props: {
        group: {
          name: group.name
        }
      }
    }
  },
  cookieConfig
)

const GroupPage: NextPage<Props> = ({
  group
}) => {
  return (
    <div>
      <h1>{group.name}</h1>
    </div>
  )
}

export default GroupPage

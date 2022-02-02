import { getById } from "@server/lib/accounts";
import { cookieConfig } from "@server/lib/auth";
import { withIronSessionSsr } from "iron-session/next";

export interface UserFromSsr {
  id: string
  displayName: string
}

export interface UserFromSsrProps {
  user: UserFromSsr | null
}

export const getUserForSsr = withIronSessionSsr<UserFromSsrProps & {[key: string]: unknown}>(async (context) => {
  const userId = context.req.session.userId
  const user = userId ? await getById(userId) : null

  return {
    props: {
      user: user ? {
        id: user.id,
        displayName: user.displayName,
      } : null
    }
  }
}, cookieConfig)

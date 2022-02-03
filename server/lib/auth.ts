import config from "@server/config";
import { buildLoginEmail } from "@server/emails/log-in";
import mailer from "@server/services/mailer";
import { sealData } from "iron-session";
import { getOrCreateUserFromEmail } from "./accounts";
import { cookieConfig } from "./sessions";

export interface EmailAuthTokenPayload {
  userId: string
}

export async function sendLogInEmail(email: string, {
  inviteCode
}: {
  inviteCode: string
}) {
  const user = await getOrCreateUserFromEmail(email)
  const token = await sealData({
    userId: user.id
  }, cookieConfig)

  const params = new URLSearchParams({
    token: token
  })
  if (inviteCode) {
    params.set('inviteCode', inviteCode)
  }
  const loginUrl = new URL('/api/auth/email', config.get('appUrl')).toString() + '?' + params.toString()

  const loginEmail = buildLoginEmail({loginUrl})
  return await mailer.sendMail({
    ...loginEmail,
    from: 'no-reply@wordler.xyz',
    to: user.email
  })
}

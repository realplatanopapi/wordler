import config from "@server/config";
import { buildLoginEmail } from "@server/emails/log-in";
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import mailer from "@server/services/mailer";
import { getById, getOrCreateUserFromEmail } from "./accounts";
import { User } from "@prisma/client";
import { ErrorWithCode } from "@server/errors";
import { TOKEN_EXPIRED } from "@server/errors/codes";

export interface AuthTokenPayload {
  userId: string
}

export async function sendLogInEmail(email: string, {
  inviteCode
}: {
  inviteCode: string
}) {
  const user = await getOrCreateUserFromEmail(email)
  const token = await createAuthToken(user.id)

  const params = new URLSearchParams({
    token: encodeURIComponent(token)
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

export async function authenticateWithToken(token: string): Promise<User | null> {
  try {
    const {userId} = await decodeAuthToken(token)
    return await getById(userId)
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ErrorWithCode(TOKEN_EXPIRED)
    }

    throw error
  }
}

function createAuthToken (userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign({
      userId
    }, config.get('authTokenSecret'), {expiresIn: '1d'}, (error: Error | null, token: string | undefined) => {
      if (error || !token) {
        return reject(error)
      }

      resolve(token)
    })
  })
}

function decodeAuthToken (token: string): Promise<AuthTokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('authTokenSecret'), (error, payload) => {
      if (error || !payload) {
        return reject(error)
      }

      resolve(payload as AuthTokenPayload)
    })
  })
}

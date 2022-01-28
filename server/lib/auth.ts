console.log(process.env)

export const cookieConfig = {
  cookieName: "wordler_auth",
  password: process.env.COOKIE_SECRET_AUTH as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}
export const cookieConfig = {
  cookieName: "auth",
  password: process.env.COOKIE_SECRET_AUTH,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}
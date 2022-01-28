import config from "@server/config";

export const cookieConfig = {
  cookieName: "wordler_auth",
  password: config.get("cookieSecret.auth"),
  cookieOptions: {
    secure: config.get('env') == "production"
  },
}
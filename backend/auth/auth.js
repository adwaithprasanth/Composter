import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { Pool } from "pg"
import dotenv from "dotenv";
dotenv.config();


const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },

  trustedOrigins: [
    "http://localhost:5173",
    "https://composter.vercel.app",
    process.env.CLIENT_URL
  ].filter(Boolean),

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  advanced: {
    useSecureCookies: true,
    cookieOptions: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      path: "/",
      domain: undefined,
    }
  },

  plugins: [
    jwt()
  ],
})

export default auth;

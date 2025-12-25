import { jwtVerify, createRemoteJWKSet } from "jose";
import { fromNodeHeaders } from "better-auth/node";
import auth from "../auth/auth.js";
import dotenv from "dotenv";
dotenv.config();

// Use environment variable for the auth URL (same as Better Auth baseURL)
const AUTH_BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// Create JWKS fetcher - this fetches the public keys from your auth server
const JWKS = createRemoteJWKSet(
  new URL(`${AUTH_BASE_URL}/api/auth/jwks`)
);

export async function authMiddleware(req, res, next) {
  // First try Better Auth session (for browser requests with cookies)
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user?.id) {
      req.user = { id: session.user.id };
      return next();
    }
  } catch (err) {
    // Session check failed, try Bearer token
  }

  // Fall back to JWT Bearer token (for CLI requests)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized - No valid session or token" });

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: AUTH_BASE_URL,
      audience: AUTH_BASE_URL,
    });

    // Better Auth puts user ID in the subject (sub)
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

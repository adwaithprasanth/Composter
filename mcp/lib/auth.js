import fs from "fs";
import path from "path";
import os from "os";
import { createRemoteJWKSet, jwtVerify } from "jose";

const SESSION_PATH = path.join(os.homedir(), ".config", "composter", "session.json");
const JWKS_URL = new URL("http://localhost:3000/api/auth/jwks");
const JWKS = createRemoteJWKSet(JWKS_URL);

export async function getLocalUser() {
  if (!fs.existsSync(SESSION_PATH)) {
    throw new Error("No session found. Please run 'composter login' in your terminal.");
  }

  let sessionData;
  try {
    const raw = fs.readFileSync(SESSION_PATH, "utf-8");
    sessionData = JSON.parse(raw);
  } catch (err) {
    throw new Error("Corrupt session file. Please run 'composter login' again.");
  }

  const token = sessionData.jwt || sessionData.token || sessionData.accessToken;

  if (!token) {
    throw new Error("Session file missing token. Please login again.");
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "http://localhost:3000",
      audience: "http://localhost:3000",
    });

    return payload.sub;
  } catch (err) {
    if (err.code === "ERR_JWT_EXPIRED") {
      throw new Error("Session expired. Please run 'composter login' to refresh.");
    }
    if (err.code === "ECONNREFUSED") {
      throw new Error("Cannot contact backend to verify token. Is your server running on localhost:3000?");
    }
    throw new Error("Authentication failed: " + err.message);
  }
}
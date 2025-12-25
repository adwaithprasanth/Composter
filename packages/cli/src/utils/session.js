import fs from "fs";
import { SESSION_PATH, ensureConfigDir } from "./paths.js";

class SessionError extends Error {
  constructor(message) {
    super(message);
    this.type = "SESSION_ERROR";
  }
}
export function saveSession(sessionData) {
  try {
    ensureConfigDir();
    fs.writeFileSync(SESSION_PATH, JSON.stringify(sessionData, null, 2), "utf-8");
  } catch (error) {
    throw new SessionError("FAILED_SESSION_SAVE");
  }
}

export function loadSession() {
  if (!fs.existsSync(SESSION_PATH)) {
    throw new SessionError("NO_SESSION");
  }
  
  let session;

  // read and parse session file
  try {
    session = JSON.parse(fs.readFileSync(SESSION_PATH, "utf-8"));
  } catch (error) {
    clearSession();
    throw new SessionError("SESSION_FILE_CORRUPT");
  }
   
  // validate session structure and if expiry is valid date
  if (!session.expiresAt || isNaN(Date.parse(session.expiresAt))) {
    clearSession();
    throw new SessionError("SESSION_INVALID");
  }

  // check if session is expired
  if (new Date(session.expiresAt) < new Date()) {
    clearSession();
    throw new SessionError("SESSION_EXPIRED");
  } 
  return session;
}

export function clearSession() {
  if (fs.existsSync(SESSION_PATH)) fs.unlinkSync(SESSION_PATH);
}

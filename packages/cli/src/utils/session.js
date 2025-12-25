import fs from "fs";
import { SESSION_PATH, ensureConfigDir } from "./paths.js";

export function saveSession(sessionData) {
  ensureConfigDir();
  fs.writeFileSync(SESSION_PATH, JSON.stringify(sessionData, null, 2), "utf-8");
}

export function loadSession() {
  if (!fs.existsSync(SESSION_PATH)) return null;
  
  try {
    const session = JSON.parse(fs.readFileSync(SESSION_PATH, "utf-8"));
    
    // Check if session is expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      console.log("Session expired. Please run 'composter login' again.");
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Invalid session file. Please run 'composter login' again.");
    clearSession();
    return null;
  }
}

export function clearSession() {
  if (fs.existsSync(SESSION_PATH)) fs.unlinkSync(SESSION_PATH);
}

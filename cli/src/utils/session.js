import fs from "fs";
import { SESSION_PATH, ensureConfigDir } from "./paths.js";

export function saveSession(sessionData) {
  ensureConfigDir();
  fs.writeFileSync(SESSION_PATH, JSON.stringify(sessionData, null, 2), "utf-8");
}

export function loadSession() {
  if (!fs.existsSync(SESSION_PATH)) return null;
  return JSON.parse(fs.readFileSync(SESSION_PATH, "utf-8"));
}

export function clearSession() {
  if (fs.existsSync(SESSION_PATH)) fs.unlinkSync(SESSION_PATH);
}

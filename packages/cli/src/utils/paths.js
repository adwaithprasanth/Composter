import os from "os";
import path from "path";
import fs from "fs";

export const CONFIG_DIR = path.join(os.homedir(), ".config", "composter");

export function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export const SESSION_PATH = path.join(CONFIG_DIR, "session.json");

import fetch from "node-fetch";
import { loadSession, clearSession } from "./session.js";
import dotenv from "dotenv";
dotenv.config({ silent: true });

const BASE_URL = process.env.BASE_URL || "https://composter.onrender.com/api";

export async function apiRequest(path, options = {}) {
  const session = loadSession();
  
  if (!session) {
    console.error("Not authenticated. Please run 'composter login'");
    process.exit(1);
  }
  
  const headers = options.headers || {};

  if (session?.jwt) {
    headers["Authorization"] = `Bearer ${session.jwt}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized (expired/invalid session)
  if (res.status === 401) {
    console.error("Authentication failed. Please run 'composter login' again");
    clearSession();
    process.exit(1);
  }

  return res;
}

import fetch from "node-fetch";
import { loadSession } from "./session.js";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL; // change later in prod

export async function apiRequest(path, options = {}) {
  const session = loadSession();
  const headers = options.headers || {};

  // attach session cookie if exists
  if (session?.cookies) {
    headers["Cookie"] = session.cookies;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return res;
}

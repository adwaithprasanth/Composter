import fetch from "node-fetch";
import { loadSession } from "./session.js";

const BASE_URL = "http://localhost:3000/api/auth"; // change later in prod

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

import fetch from "node-fetch";
import { FetchError } from "node-fetch";

export async function safeFetch(url, options = {}) {

  let res;

  const controller = new AbortController(); // to handle timeouts
    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);

  try {
    res = await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      throw new FetchError("NETWORK_UNREACHABLE", 'FETCH_ERROR');
    }

    if (err.name === "AbortError") {
      throw new FetchError("NETWORK_TIMEOUT", 'FETCH_ERROR');
    }

    throw new FetchError("NETWORK_ERROR", 'FETCH_ERROR');
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new FetchError("UNAUTHORIZED", 'FETCH_ERROR');
    }

    if (res.status === 404) {
      throw new FetchError("NOT_FOUND", 'FETCH_ERROR');
    }

    if (res.status >= 500) {
      throw new FetchError("SERVER_ERROR", 'FETCH_ERROR');
    }

    // Other HTTP errors will be handled by the caller
    // these are mostly client errors (4xx) like 400, 409 etc.
    return res;
  }

  return res;
}


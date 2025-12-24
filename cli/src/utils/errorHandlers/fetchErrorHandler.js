import { log } from "../log.js";

export function handleFetchError(err) {
  switch (err.message) {
    case "NETWORK_UNREACHABLE":
      log.error("Cannot reach server. Check your internet or VPN connection.");
      break;

    case "SESSION_EXPIRED":
      log.warn("Your session has expired. Please log in again.");
      break;
    
    case "UNAUTHORIZED":
      log.error("Invalid email or password.");
      break;

    case "NOT_FOUND":
      log.error("Requested resource not found.");
      break;

    case "SERVER_ERROR":
      log.error("Service temporarily unavailable. Try again later.");
      break;

    default:
      log.error("An unexpected error occurred.");
  }

  if (process.env.DEBUG) {
    console.error(err);
  }
}

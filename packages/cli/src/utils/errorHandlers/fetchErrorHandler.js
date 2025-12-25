import { log } from "../log.js";

export function handleFetchError(err) {
  switch (err.message) {
    case "NETWORK_UNREACHABLE":
      log.error("Cannot reach server. Check your internet or VPN connection.");
      break;

    case "SESSION_EXPIRED":
      log.warn("Your session has expired. Please log in again.");
      break;

    case "NETWORK_TIMEOUT":
      log.warn("Network request timed out. Please try again.");
      break;
    
    case "UNAUTHORIZED":
      log.error("Invalid email or password.");
      break;

    case "NOT_FOUND":
      log.error("Requested resource does not exist.");
      break;

    case "SERVER_ERROR":
      log.error("Service temporarily unavailable. Try again later.");
      break;

    default:
      log.error("An unexpected error occurred.");
  }

  if (process.env.DEBUG === "1" || process.env.DEBUG === "true") {
    console.error(err);
  }
}

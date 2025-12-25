import { log } from "../log.js";

export function handleSessionError(err) {
  switch (err.message) {
    case "FAILED_SESSION_SAVE":
      log.error("Failed to save session data. Please try logging in again.");
      break;

    case "NO_SESSION":
      log.warn("You need to log in first.");
      log.info("Run: composter login");
      break;

    case "SESSION_FILE_CORRUPT":
      log.warn("Session file is corrupt. Please log in again.");
      break;

    case "SESSION_INVALID":
      log.warn("Session data is invalid. Please log in again.");
      break;

    case "SESSION_EXPIRED":
      log.warn("Your session has expired. Please log in again.");
      break;
    default:
      log.error("An unexpected error occurred.");
  }

  if (process.env.DEBUG === "1" || process.env.DEBUG === "true") {
    console.error(err);
  }
}

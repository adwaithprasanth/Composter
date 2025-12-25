import { log } from "../utils/log.js";
import { apiRequest } from "../utils/request.js";

export async function mkcat(categoryName) {
  // Validate input
  if (
    !categoryName ||
    categoryName.trim() === "" ||
    categoryName.includes(" ") ||
    categoryName.length > 10
  ) {
    log.warn(
      "Invalid category name. It must be non-empty, without spaces, and at most 10 characters."
    );
    process.exit(1);
  }

    const res = await apiRequest("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });

    // Parse JSON once
    let body = null;
    try {
      body = await res.json();
    } catch {
      // Ignore if no JSON
    }

    if (res.ok) {
      log.info(`Category '${categoryName}' created successfully!`);
      process.exit(0);
    }

    // handling server sent errors, like duplicate category
    const msg =
      (body && (body.error || body.message || JSON.stringify(body))) ||
      `HTTP ${res.status}`;

    log.error(`Failed to create category: ${msg}`);
    process.exit(1);
}

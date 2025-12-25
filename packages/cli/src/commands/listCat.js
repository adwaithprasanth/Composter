import chalk from "chalk";
import { apiRequest } from "../utils/request.js";
import { log } from "../utils/log.js";

export async function listCategories() {

  const res = await apiRequest("/categories", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  let body = null;

  try {
    body = await res.json();
  } catch {
    // Ignore if no JSON
  }



  const categories = body?.categories || [];
  if (categories.length === 0) {
    log.info("No categories found.");
    return;
  }
  categories.forEach((cat) => {
    //list them adjacent to each other with tab space between
    process.stdout.write(chalk.cyan.bold(cat.name) + "\t\t");
  });
  console.log();
  return;
}

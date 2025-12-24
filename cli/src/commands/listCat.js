import { apiRequest } from "../utils/request.js";

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
    console.log("No categories found.");
    return;
  }
  categories.forEach((cat) => {
    //list them adjacent to each other with tab space between
    process.stdout.write(`${cat.name}\t\t`);
  });
  console.log();
  return;
}

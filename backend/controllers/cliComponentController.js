import prisma from "../prisma/prisma.js";

export async function pushComponent(req, res) {
  try {
    const { title, code, category } = req.body;
    const userId = req.user.id;

    if (!title || !code || !category) {
      return res.status(400).json({ error: "title, code, and category are required" });
    }

    // Step 1 — check if category exists
    let cat = await prisma.category.findFirst({
      where: { name: category, userId },
    });

    // Step 2 — if not exists, create category (NO EXPRESS CONTROLLER INVOCATION)
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: category, userId },
      });
    }

    // Step 3 — create component under that category
    const component = await prisma.component.create({
      data: {
        title,
        code,
        categoryId: cat.id,
        userId,
      },
    });

    return res.status(201).json({ component });

  } catch (err) {
    console.error("Push Component Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


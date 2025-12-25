import { Router } from "express";
import { createCategory, listCategories, countCategories } from "../controllers/cliCategoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const categoryRouter = Router();

categoryRouter.post("/", authMiddleware, createCategory);
categoryRouter.get("/count", authMiddleware, countCategories);
categoryRouter.get("/", authMiddleware, listCategories);

export default categoryRouter;

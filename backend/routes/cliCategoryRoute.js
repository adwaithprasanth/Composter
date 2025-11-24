import { Router } from "express";
import { createCategory } from "../controllers/cliCategoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const categoryRouter = Router();

categoryRouter.post("/", authMiddleware, createCategory);

export default categoryRouter;

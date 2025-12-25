import { Router } from "express";
import { 
  pushComponent, 
  pullComponent, 
  countComponents, 
  listComponents, 
  getComponentById, 
  recentComponents,
  searchComponents,
  listComponentsByCategory,
  deleteComponent
} from "../controllers/cliComponentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const componentRouter = Router();

componentRouter.post("/", authMiddleware, pushComponent);
componentRouter.get("/list", authMiddleware, listComponents);
componentRouter.get("/list-by-category", authMiddleware, listComponentsByCategory);
componentRouter.get("/search", authMiddleware, searchComponents);
componentRouter.get("/recent", authMiddleware, recentComponents);
componentRouter.get("/count", authMiddleware, countComponents);
componentRouter.get("/:id", authMiddleware, getComponentById);
componentRouter.get("/", authMiddleware, pullComponent);
componentRouter.delete("/:id", authMiddleware, deleteComponent);
export default componentRouter;

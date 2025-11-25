import { Router } from "express";
import { pushComponent } from "../controllers/cliComponentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const componentRouter = Router();

componentRouter.post("/", authMiddleware, pushComponent);

export default componentRouter;

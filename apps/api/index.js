import express from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./auth/auth.js";
import cors from "cors";
import categoryRouter from "./routes/cliCategoryRoute.js";
import componentRouter from "./routes/cliComponentRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//CORS - Support multiple origins for local and production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://composter.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "User-Agent"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // 24 hours - cache preflight
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

//Better-Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
app.use(express.json());

//Create Category Route
app.use("/api/categories", categoryRouter);
//List Categories Route
app.use("/api/categories", categoryRouter);
//Create Component Route
app.use("/api/components", componentRouter);
//Pull Component Route
app.use("/api/components", componentRouter);
//Count Components Route


//Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

//Get Current User Session
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

export default app;
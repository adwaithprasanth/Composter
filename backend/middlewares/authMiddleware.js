import { jwtVerify, createRemoteJWKSet } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("http://localhost:3000/api/auth/jwks")
);

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing or invalid Authorization header" });

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "http://localhost:3000",
      audience: "http://localhost:3000",
    });

    // Better Auth puts user ID in the subject (sub)
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

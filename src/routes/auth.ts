import { Router, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { generateApiKey } from "../lib/apikey";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// POST /auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email || !password) {
    res.status(400).json({ error: { message: "email and password are required", type: "invalid_request_error" } });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: { message: "password must be at least 8 characters", type: "invalid_request_error" } });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: { message: "An account with that email already exists", type: "invalid_request_error" } });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name ?? null,
    },
  });

  const key = generateApiKey();
  await prisma.apiKey.create({
    data: {
      userId: user.id,
      key,
      name: "Default",
    },
  });

  const token = signToken({ userId: user.id, email: user.email, plan: user.plan });
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: { message: "email and password are required", type: "invalid_request_error" } });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: { message: "Invalid email or password", type: "auth_error" } });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: { message: "Invalid email or password", type: "auth_error" } });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email, plan: user.plan });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
});

// POST /auth/logout (client just drops the token; here we return ok)
router.post("/logout", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// GET /auth/me
router.get("/me", authMiddleware, async (_req: Request, res: Response) => {
  const userId = res.locals.userId as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { apiKeys: { where: { active: true }, orderBy: { createdAt: "asc" } } },
  });

  if (!user) {
    res.status(404).json({ error: { message: "User not found", type: "not_found" } });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    createdAt: user.createdAt,
    apiKeys: user.apiKeys.map((k) => ({
      id: k.id,
      name: k.name,
      key: k.key,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    })),
  });
});

export default router;

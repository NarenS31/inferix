import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

const COOKIE_NAME = "inferix_dashboard_auth";

function generateApiKey(): string {
  return "inf_live_" + randomBytes(16).toString("hex");
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string; name?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  if (body.password.length < 8) {
    return NextResponse.json({ error: "password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await prisma.user.create({
    data: { email: body.email, passwordHash, name: body.name ?? null },
  });

  const key = generateApiKey();
  await prisma.apiKey.create({ data: { userId: user.id, key, name: "Default" } });

  const token = await signToken({ userId: user.id, email: user.email, plan: user.plan });

  const response = NextResponse.json(
    { ok: true, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } },
    { status: 201 }
  );
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}

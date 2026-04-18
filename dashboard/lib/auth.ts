import { cookies } from "next/headers";
import { verifyToken, type JwtPayload } from "./jwt";

const COOKIE_NAME = "inferix_dashboard_auth";

export async function getCurrentUser(): Promise<JwtPayload | null> {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

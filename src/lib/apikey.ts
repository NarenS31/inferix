import { randomBytes } from "crypto";

export function generateApiKey(): string {
  return "inf_live_" + randomBytes(16).toString("hex");
}

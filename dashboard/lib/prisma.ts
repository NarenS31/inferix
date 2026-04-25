import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
	// eslint-disable-next-line no-var
	var __inferixDashboardPrisma: PrismaClient | undefined;
}

function createClient() {
	const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
	return new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
	});
}

export const prisma = globalThis.__inferixDashboardPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.__inferixDashboardPrisma = prisma;
}

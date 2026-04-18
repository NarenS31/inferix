import { PrismaClient } from "../../node_modules/@prisma/client";

declare global {
	// eslint-disable-next-line no-var
	var __inferixDashboardPrisma: PrismaClient | undefined;
}

export const prisma =
	globalThis.__inferixDashboardPrisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalThis.__inferixDashboardPrisma = prisma;
}

import { PrismaClient } from "../../node_modules/@prisma/client";
import fs from "node:fs";
import path from "node:path";

if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
	const enginePath = path.resolve(process.cwd(), "../node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node");
	if (fs.existsSync(enginePath)) {
		process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
	}
}

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

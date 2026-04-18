-- AlterTable
ALTER TABLE "RequestLog" ADD COLUMN     "cacheHit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cacheSimilarity" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Cache" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "endpointTag" TEXT NOT NULL,
    "promptHash" TEXT NOT NULL,
    "promptEmbedding" DOUBLE PRECISION[],
    "response" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CacheSetting" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "endpointTag" TEXT NOT NULL DEFAULT '*',
    "ttlSeconds" INTEGER NOT NULL DEFAULT 86400,
    "similarityThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.92,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CacheSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cache_userId_endpointTag_idx" ON "Cache"("userId", "endpointTag");

-- CreateIndex
CREATE INDEX "Cache_userId_promptHash_idx" ON "Cache"("userId", "promptHash");

-- CreateIndex
CREATE INDEX "Cache_expiresAt_idx" ON "Cache"("expiresAt");

-- CreateIndex
CREATE INDEX "CacheSetting_userId_idx" ON "CacheSetting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CacheSetting_userId_endpointTag_key" ON "CacheSetting"("userId", "endpointTag");

-- CreateIndex
CREATE INDEX "RequestLog_cacheHit_idx" ON "RequestLog"("cacheHit");

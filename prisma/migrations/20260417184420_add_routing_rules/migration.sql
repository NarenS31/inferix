-- CreateTable
CREATE TABLE "RoutingRule" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "endpointTag" TEXT NOT NULL DEFAULT '*',
    "preferredModels" TEXT[],
    "costCeilingUsd" DOUBLE PRECISION,
    "latencyThresholdMs" INTEGER,
    "maxTokens" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoutingRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoutingRule_userId_idx" ON "RoutingRule"("userId");

-- CreateIndex
CREATE INDEX "RoutingRule_userId_endpointTag_idx" ON "RoutingRule"("userId", "endpointTag");

-- CreateIndex
CREATE INDEX "RoutingRule_active_idx" ON "RoutingRule"("active");

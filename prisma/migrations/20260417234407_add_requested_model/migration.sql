-- AlterTable
ALTER TABLE "RequestLog" ADD COLUMN     "requestedModel" TEXT;

-- CreateIndex
CREATE INDEX "RequestLog_requestedModel_idx" ON "RequestLog"("requestedModel");

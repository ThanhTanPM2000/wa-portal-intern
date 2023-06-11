-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_LOGGED_IN', 'USER_LOGGED_OUT', 'USER_ADDED', 'WABA_CONNECTION_REQUEST', 'WABA_CONNECTED', 'PARTNER_TOKEN_GENERATED', 'PARTNER_TOKEN_DELETED', 'PARTNER_TOKEN_USED', 'PARTNER_PROMOTED', 'PARTNER_ACTIVATED', 'PARTNER_DEACTIVATED', 'CREDIT_LINE_REVOKED', 'CREDIT_LINE_SHARED');

-- CreateTable
CREATE TABLE "Audit" (
    "id" SERIAL NOT NULL,
    "action" "AuditAction" NOT NULL,
    "payload" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Audit.action_index" ON "Audit"("action");

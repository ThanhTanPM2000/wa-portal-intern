-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'USER_INIT_EMBEDDED_SIGNUP';
ALTER TYPE "AuditAction" ADD VALUE 'USER_FINISH_EMBEDDED_SIGNUP';
ALTER TYPE "AuditAction" ADD VALUE 'WABA_CONNECTION_FAILED';

-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "authorId" INTEGER;

-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "providedServerCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceProvidersOnPartners" (
    "partnerId" INTEGER NOT NULL,
    "serviceProviderId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("partnerId","serviceProviderId")
);

-- AddForeignKey
ALTER TABLE "ServiceProvidersOnPartners" ADD FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProvidersOnPartners" ADD FOREIGN KEY ("serviceProviderId") REFERENCES "ServiceProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `partnerTokenId` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the `PartnerToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PartnerToken" DROP CONSTRAINT "PartnerToken_accountId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerToken" DROP CONSTRAINT "PartnerToken_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_partnerTokenId_fkey";

-- AlterTable
ALTER TABLE "Manager" DROP COLUMN "partnerTokenId",
ADD COLUMN     "partnerKeyId" INTEGER;

-- AlterTable
ALTER TABLE "PhoneNumber" ADD COLUMN     "provisionServerUrl" TEXT,
ADD COLUMN     "provisionServerApiKey" TEXT;

-- DropTable
DROP TABLE "PartnerToken";

-- CreateTable
CREATE TABLE "PartnerKey" (
    "id" SERIAL NOT NULL,
    "partnerId" INTEGER NOT NULL,
    "accountId" INTEGER,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isUsingProvisionServer" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerKey.partnerId_value_unique" ON "PartnerKey"("partnerId", "value");

-- CreateIndex
CREATE INDEX "PartnerKey.partnerId_value_index" ON "PartnerKey"("partnerId", "value");

-- AddForeignKey
ALTER TABLE "PartnerKey" ADD FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerKey" ADD FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD FOREIGN KEY ("partnerKeyId") REFERENCES "PartnerKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

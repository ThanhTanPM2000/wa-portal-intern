/*
  Warnings:

  - You are about to drop the column `isUsingProvisionServer` on the `PartnerKey` table. All the data in the column will be lost.
  - You are about to drop the column `provisionServerApiKey` on the `PhoneNumber` table. All the data in the column will be lost.
  - You are about to drop the column `provisionServerUrl` on the `PhoneNumber` table. All the data in the column will be lost.
  - You are about to drop the column `endpoint` on the `ServiceProvider` table. All the data in the column will be lost.
  - You are about to drop the column `providedServerCount` on the `ServiceProvider` table. All the data in the column will be lost.
  - Added the required column `options` to the `ServiceProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_userId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerKey" DROP CONSTRAINT "PartnerKey_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerKey" DROP CONSTRAINT "PartnerKey_serviceProviderId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "ServiceProvider.endpoint_unique";

-- AlterTable
ALTER TABLE "PartnerKey" DROP COLUMN "isUsingProvisionServer";

-- AlterTable
ALTER TABLE "PhoneNumber" DROP COLUMN "provisionServerApiKey",
DROP COLUMN "provisionServerUrl";

-- AlterTable
ALTER TABLE "ServiceProvider" DROP COLUMN "endpoint",
DROP COLUMN "providedServerCount",
ADD COLUMN     "options" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "ProvisionServer" (
    "id" SERIAL NOT NULL,
    "options" JSONB NOT NULL,
    "serviceProviderId" INTEGER NOT NULL,
    "phoneNumberId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProvisionServer_phoneNumberId_unique" ON "ProvisionServer"("phoneNumberId");

-- AddForeignKey
ALTER TABLE "Account" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerKey" ADD FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerKey" ADD FOREIGN KEY ("serviceProviderId") REFERENCES "ServiceProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvisionServer" ADD FOREIGN KEY ("serviceProviderId") REFERENCES "ServiceProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvisionServer" ADD FOREIGN KEY ("phoneNumberId") REFERENCES "PhoneNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

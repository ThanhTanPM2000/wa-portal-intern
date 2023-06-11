-- AlterTable
ALTER TABLE "PartnerKey" ADD COLUMN     "serviceProviderId" INTEGER;

-- AddForeignKey
ALTER TABLE "PartnerKey" ADD FOREIGN KEY ("serviceProviderId") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

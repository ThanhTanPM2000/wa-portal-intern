/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ServiceProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endpoint]` on the table `ServiceProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ServiceProvider" ALTER COLUMN "providedServerCount" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider.name_unique" ON "ServiceProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider.endpoint_unique" ON "ServiceProvider"("endpoint");

-- CreateIndex
CREATE INDEX "ServiceProvider.name_index" ON "ServiceProvider"("name");

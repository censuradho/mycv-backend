/*
  Warnings:

  - You are about to drop the column `region` on the `addresses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "addresses_country_city_region_idx";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "region";

-- CreateIndex
CREATE INDEX "addresses_country_city_idx" ON "addresses"("country", "city");

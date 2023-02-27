/*
  Warnings:

  - You are about to drop the column `availability` on the `curriculums` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `company_site` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `office` on the `experiences` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `experiences` table. All the data in the column will be lost.
  - Added the required column `employer` to the `experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `experiences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "curriculums" DROP COLUMN "availability";

-- AlterTable
ALTER TABLE "experiences" DROP COLUMN "company_name",
DROP COLUMN "company_site",
DROP COLUMN "office",
DROP COLUMN "type",
ADD COLUMN     "employer" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `occupation` on the `curriculums` table. All the data in the column will be lost.
  - Added the required column `title` to the `curriculums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "curriculums" DROP COLUMN "occupation",
ADD COLUMN     "title" TEXT NOT NULL;

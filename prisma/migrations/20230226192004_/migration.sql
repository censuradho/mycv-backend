/*
  Warnings:

  - You are about to drop the column `photo` on the `users` table. All the data in the column will be lost.
  - Added the required column `slug` to the `curriculums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "curriculums" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "photo";

/*
  Warnings:

  - You are about to drop the column `curriculum_id` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_curriculum_id_fkey";

-- DropIndex
DROP INDEX "files_curriculum_id_key";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "curriculum_id",
ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "files_user_id_key" ON "files"("user_id");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

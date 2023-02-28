/*
  Warnings:

  - You are about to drop the column `user_id` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[curriculum_id]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_user_id_fkey";

-- DropIndex
DROP INDEX "files_user_id_key";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "user_id",
ADD COLUMN     "curriculum_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "files_curriculum_id_key" ON "files"("curriculum_id");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

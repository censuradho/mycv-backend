/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `curriculums` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "curriculums_slug_key" ON "curriculums"("slug");

/*
  Warnings:

  - A unique constraint covering the columns `[initials]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `initials` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "initials" VARCHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "doctors_initials_key" ON "doctors"("initials");

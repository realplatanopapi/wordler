/*
  Warnings:

  - You are about to drop the column `date` on the `Wordle` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Wordle_date_key";

-- AlterTable
ALTER TABLE "Wordle" DROP COLUMN "date";

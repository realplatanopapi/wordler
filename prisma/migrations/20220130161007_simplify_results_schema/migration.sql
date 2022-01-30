/*
  Warnings:

  - You are about to drop the `WordleAttempt` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attemptsUsed` to the `WordleResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `didSolve` to the `WordleResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guesses` to the `WordleResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAttempts` to the `WordleResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `WordleResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WordleAttempt" DROP CONSTRAINT "WordleAttempt_wordleResultId_fkey";

-- AlterTable
ALTER TABLE "WordleResult" ADD COLUMN     "attemptsUsed" INTEGER NOT NULL,
ADD COLUMN     "didSolve" BOOLEAN NOT NULL,
ADD COLUMN     "guesses" JSONB NOT NULL,
ADD COLUMN     "maxAttempts" INTEGER NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL;

-- DropTable
DROP TABLE "WordleAttempt";

-- DropEnum
DROP TYPE "WordleGuessResult";

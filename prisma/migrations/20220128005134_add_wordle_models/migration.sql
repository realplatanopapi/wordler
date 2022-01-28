-- CreateEnum
CREATE TYPE "WordleGuessResult" AS ENUM ('EXACT_MATCH', 'IN_WORD', 'NOT_IN_WORD');

-- CreateTable
CREATE TABLE "Wordle" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "number" BIGINT NOT NULL,

    CONSTRAINT "Wordle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordleResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wordleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WordleResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordleAttempt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wordleResultId" TEXT NOT NULL,
    "guesses" "WordleGuessResult"[],

    CONSTRAINT "WordleAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wordle_date_key" ON "Wordle"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Wordle_number_key" ON "Wordle"("number");

-- AddForeignKey
ALTER TABLE "WordleResult" ADD CONSTRAINT "WordleResult_wordleId_fkey" FOREIGN KEY ("wordleId") REFERENCES "Wordle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordleResult" ADD CONSTRAINT "WordleResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordleAttempt" ADD CONSTRAINT "WordleAttempt_wordleResultId_fkey" FOREIGN KEY ("wordleResultId") REFERENCES "WordleResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

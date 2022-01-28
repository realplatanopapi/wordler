/*
  Warnings:

  - A unique constraint covering the columns `[userId,wordleId]` on the table `WordleResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WordleResult_userId_wordleId_key" ON "WordleResult"("userId", "wordleId");

-- DropForeignKey
ALTER TABLE "GroupInviteCode" DROP CONSTRAINT "GroupInviteCode_createdById_fkey";

-- DropForeignKey
ALTER TABLE "GroupInviteCode" DROP CONSTRAINT "GroupInviteCode_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembership" DROP CONSTRAINT "GroupMembership_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembership" DROP CONSTRAINT "GroupMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "WordleResult" DROP CONSTRAINT "WordleResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "WordleResult" DROP CONSTRAINT "WordleResult_wordleId_fkey";

-- AddForeignKey
ALTER TABLE "WordleResult" ADD CONSTRAINT "WordleResult_wordleId_fkey" FOREIGN KEY ("wordleId") REFERENCES "Wordle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordleResult" ADD CONSTRAINT "WordleResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInviteCode" ADD CONSTRAINT "GroupInviteCode_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInviteCode" ADD CONSTRAINT "GroupInviteCode_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

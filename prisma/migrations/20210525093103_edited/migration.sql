/*
  Warnings:

  - You are about to drop the column `portfolioId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_portfolioId_fkey";

-- DropIndex
DROP INDEX "User_portfolioId_unique";

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "portfolioId";

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_unique" ON "Portfolio"("userId");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

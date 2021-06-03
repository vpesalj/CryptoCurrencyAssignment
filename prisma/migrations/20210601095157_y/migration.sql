/*
  Warnings:

  - You are about to drop the column `portfolioId` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `investmentGroupId` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_portfolioId_fkey";

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "portfolioId",
ADD COLUMN     "investmentGroupId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "InvestmentGroup" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "portfolioId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvestmentGroup" ADD FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD FOREIGN KEY ("investmentGroupId") REFERENCES "InvestmentGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

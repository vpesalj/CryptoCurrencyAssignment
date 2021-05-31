-- AlterTable
ALTER TABLE "InvestmentValue" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PortfolioValue" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

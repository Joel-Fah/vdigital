/*
  Warnings:

  - You are about to drop the column `duration` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `priceNote` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "duration",
DROP COLUMN "icon",
DROP COLUMN "priceNote",
ADD COLUMN     "durationUnit" TEXT,
ADD COLUMN     "durationValue" INTEGER,
ADD COLUMN     "priceAmount" INTEGER,
ADD COLUMN     "priceCurrency" TEXT;

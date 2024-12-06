/*
  Warnings:

  - You are about to drop the column `total_amount` on the `PaymentRequestEntry` table. All the data in the column will be lost.
  - Added the required column `amount` to the `PaymentRequestEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentRequestEntry" DROP COLUMN "total_amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

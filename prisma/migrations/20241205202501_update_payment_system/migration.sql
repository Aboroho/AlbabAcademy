/*
  Warnings:

  - You are about to drop the column `payment_request_id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_template_id` on the `PaymentRequest` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payment_request_id_fkey";

-- DropForeignKey
ALTER TABLE "PaymentRequest" DROP CONSTRAINT "PaymentRequest_payment_template_id_fkey";

-- DropIndex
DROP INDEX "Payment_user_id_payment_request_id_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payment_request_id",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "payment_request_entry_id" INTEGER;

-- AlterTable
ALTER TABLE "PaymentRequest" DROP COLUMN "payment_template_id";

-- CreateTable
CREATE TABLE "PaymentRequestEntry" (
    "id" SERIAL NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "stipend" INTEGER NOT NULL DEFAULT 0,
    "payment_details" JSONB[],
    "payment_request_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRequestEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentRequestEntry" ADD CONSTRAINT "PaymentRequestEntry_payment_request_id_fkey" FOREIGN KEY ("payment_request_id") REFERENCES "PaymentRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRequestEntry" ADD CONSTRAINT "PaymentRequestEntry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_request_entry_id_fkey" FOREIGN KEY ("payment_request_entry_id") REFERENCES "PaymentRequestEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

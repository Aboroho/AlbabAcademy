/*
  Warnings:

  - You are about to drop the column `notice_category_id` on the `Notice` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `Notice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10000)`.
  - You are about to drop the `NoticeCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notice_target` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NoticeTarget" ADD VALUE 'ALL_USERS';
ALTER TYPE "NoticeTarget" ADD VALUE 'SPECIFIC_USER';

-- DropForeignKey
ALTER TABLE "Notice" DROP CONSTRAINT "Notice_notice_category_id_fkey";

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "notice_category_id",
ADD COLUMN     "attachment" VARCHAR(4072),
ADD COLUMN     "category" "NoticeType" NOT NULL,
ADD COLUMN     "notice_target" "NoticeTarget" NOT NULL,
ADD COLUMN     "notice_target_id" INTEGER,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(10000);

-- DropTable
DROP TABLE "NoticeCategory";

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_notice_target_id_fkey" FOREIGN KEY ("notice_target_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

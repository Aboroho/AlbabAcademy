/*
  Warnings:

  - You are about to drop the column `attachment` on the `Notice` table. All the data in the column will be lost.
  - Added the required column `notice_category` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NoticeCategory" AS ENUM ('RECRUITMENT', 'ANNOUNCEMENT', 'STUDENT_NOTICE', 'TEACHER_NOTICE');

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "attachment",
ADD COLUMN     "attachments" VARCHAR(4072),
ADD COLUMN     "notice_category" "NoticeCategory" NOT NULL;

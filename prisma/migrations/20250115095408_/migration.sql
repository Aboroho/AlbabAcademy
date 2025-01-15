/*
  Warnings:

  - The values [PUBLIC,USER] on the enum `NoticeTarget` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `category` on the `Notice` table. All the data in the column will be lost.
  - Added the required column `notice_type` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NoticeTarget_new" AS ENUM ('ALL_USERS', 'STUDENT', 'TEACHER', 'ADMIN', 'STAFF', 'DIRECTOR', 'SUPER_ADMIN', 'SPECIFIC_USER');
ALTER TABLE "Notice" ALTER COLUMN "notice_target" TYPE "NoticeTarget_new" USING ("notice_target"::text::"NoticeTarget_new");
ALTER TYPE "NoticeTarget" RENAME TO "NoticeTarget_old";
ALTER TYPE "NoticeTarget_new" RENAME TO "NoticeTarget";
DROP TYPE "NoticeTarget_old";
COMMIT;

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "category",
ADD COLUMN     "notice_type" "NoticeType" NOT NULL;

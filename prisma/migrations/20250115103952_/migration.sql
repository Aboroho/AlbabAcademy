-- CreateEnum
CREATE TYPE "NoticeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "status" "NoticeStatus" NOT NULL DEFAULT 'ACTIVE';

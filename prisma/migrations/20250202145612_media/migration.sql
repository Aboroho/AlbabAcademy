/*
  Warnings:

  - You are about to drop the column `file_type` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `media_url` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asset_id]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asset_id` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('AUDIO', 'VIDEO', 'IMAGE', 'DOC', 'OTHER');

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "file_type",
DROP COLUMN "media_url",
ADD COLUMN     "asset_id" TEXT NOT NULL,
ADD COLUMN     "group" TEXT,
ADD COLUMN     "type" "FileType" DEFAULT 'IMAGE',
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Media_asset_id_key" ON "Media"("asset_id");

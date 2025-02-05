/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `StaticPage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `StaticPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StaticPage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StaticPage_slug_key" ON "StaticPage"("slug");

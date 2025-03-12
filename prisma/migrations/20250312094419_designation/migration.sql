/*
  Warnings:

  - The `designation` column on the `Teacher` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('STAFF', 'TEACHER', 'DIRECTOR', 'ASSISTENT_TEACHER', 'ACCOUNTANT', 'LIBRARIAN', 'SECRETARY', 'PRINCIPAL', 'OTHER');

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "designation",
ADD COLUMN     "designation" "Designation" NOT NULL DEFAULT 'TEACHER';

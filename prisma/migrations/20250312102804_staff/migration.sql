/*
  Warnings:

  - The values [OTHER] on the enum `Designation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Designation_new" AS ENUM ('STAFF', 'TEACHER', 'DIRECTOR', 'ASSISTENT_TEACHER', 'ACCOUNTANT', 'LIBRARIAN', 'SECRETARY', 'PRINCIPAL');
ALTER TABLE "Teacher" ALTER COLUMN "designation" DROP DEFAULT;
ALTER TABLE "Teacher" ALTER COLUMN "designation" TYPE "Designation_new" USING ("designation"::text::"Designation_new");
ALTER TYPE "Designation" RENAME TO "Designation_old";
ALTER TYPE "Designation_new" RENAME TO "Designation";
DROP TYPE "Designation_old";
ALTER TABLE "Teacher" ALTER COLUMN "designation" SET DEFAULT 'TEACHER';
COMMIT;

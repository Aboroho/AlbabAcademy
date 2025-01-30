/*
  Warnings:

  - You are about to drop the column `creator_id` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `result_date` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `AssessmentResult` table. All the data in the column will be lost.
  - You are about to drop the column `total_mark` on the `AssessmentSubject` table. All the data in the column will be lost.
  - Added the required column `assessment_id` to the `AssessmentResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_marks` to the `AssessmentSubject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AssessmentStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "AssessmentStatus" ADD VALUE 'GRADED';

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_creator_id_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "creator_id",
DROP COLUMN "result_date",
ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "AssessmentResult" DROP COLUMN "status",
ADD COLUMN     "assessment_id" INTEGER NOT NULL,
ALTER COLUMN "mark" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "AssessmentSubject" DROP COLUMN "total_mark",
ADD COLUMN     "total_marks" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_assessment_subject_id_fkey" FOREIGN KEY ("assessment_subject_id") REFERENCES "AssessmentSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

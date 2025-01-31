/*
  Warnings:

  - A unique constraint covering the columns `[assessment_id,assessment_subject_id,student_id]` on the table `AssessmentResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AssessmentResult_assessment_id_assessment_subject_id_key";

-- DropIndex
DROP INDEX "AssessmentResult_student_id_assessment_subject_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_assessment_id_assessment_subject_id_studen_key" ON "AssessmentResult"("assessment_id", "assessment_subject_id", "student_id");

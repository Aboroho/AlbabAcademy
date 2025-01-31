/*
  Warnings:

  - A unique constraint covering the columns `[assessment_id,assessment_subject_id]` on the table `AssessmentResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_assessment_id_assessment_subject_id_key" ON "AssessmentResult"("assessment_id", "assessment_subject_id");

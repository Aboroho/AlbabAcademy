/*
  Warnings:

  - The primary key for the `AssessmentType` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "district" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "sub_district" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "union" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "village" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "Assessment" ALTER COLUMN "title" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "AssessmentSubject" ALTER COLUMN "subject_name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "AssessmentType" DROP CONSTRAINT "AssessmentType_pkey",
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "AssessmentType_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Director" ALTER COLUMN "full_name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PaymentTemplate" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "father_name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "mother_name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "guardian_phone" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "designation" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET DATA TYPE VARCHAR(64);

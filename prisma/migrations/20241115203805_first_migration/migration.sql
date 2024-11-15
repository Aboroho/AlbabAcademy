-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'STAFF', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "CohortStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "PaymentTargetTypes" AS ENUM ('STUDENT', 'TEACHER', 'GRADE', 'SECTION', 'COHORT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PROCESSING', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ONLINE', 'CASH');

-- CreateEnum
CREATE TYPE "RESIDENTIAL_STATUS" AS ENUM ('RESIDENTIAL', 'NON_RESIDENTIAL');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'GRADED');

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "district" VARCHAR(15),
    "sub_district" VARCHAR(15),
    "union" VARCHAR(15),
    "village" VARCHAR(15),

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(12) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "role" "Role" NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(32),
    "avatar" VARCHAR(512),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(32) NOT NULL,
    "designation" VARCHAR(32) NOT NULL,
    "description" VARCHAR(512),
    "subject_expertise" VARCHAR(128),
    "date_of_joining" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "qualification" VARCHAR(128),
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade_id" INTEGER NOT NULL,
    "class_teacher_id" INTEGER,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CohortStatus" NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "student_id" VARCHAR(32) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cohort_id" INTEGER NOT NULL,
    "roll" INTEGER NOT NULL,
    "full_name" VARCHAR(32) NOT NULL,
    "father_name" VARCHAR(32) NOT NULL,
    "mother_name" VARCHAR(32) NOT NULL,
    "guardian_phone" VARCHAR(11) NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "residential_status" "RESIDENTIAL_STATUS" NOT NULL DEFAULT 'NON_RESIDENTIAL',
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentType" (
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "AssessmentType_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "assessment_type" VARCHAR(20),
    "date" TIMESTAMP(3) NOT NULL,
    "result_date" TIMESTAMP(3),
    "creator_id" INTEGER,
    "assessment_status" "AssessmentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade_id" INTEGER NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSubject" (
    "id" SERIAL NOT NULL,
    "subject_name" VARCHAR(32) NOT NULL,
    "total_mark" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "assessment_id" INTEGER NOT NULL,

    CONSTRAINT "AssessmentSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTemplateField" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_template_id" INTEGER NOT NULL,

    CONSTRAINT "PaymentTemplateField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTemplate" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRequest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "forMonth" VARCHAR(32),
    "forYear" VARCHAR(32),
    "payment_template_id" INTEGER NOT NULL,
    "payment_target_type" "PaymentTargetTypes" NOT NULL,

    CONSTRAINT "PaymentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PROCESSING',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "user_id" INTEGER NOT NULL,
    "payment_request_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_user_id_key" ON "Teacher"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_name_key" ON "Grade"("name");

-- CreateIndex
CREATE INDEX "Section_name_idx" ON "Section"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Section_grade_id_name_key" ON "Section"("grade_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_name_key" ON "Cohort"("name");

-- CreateIndex
CREATE INDEX "Cohort_section_id_name_idx" ON "Cohort"("section_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_id_key" ON "Student"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_roll_cohort_id_key" ON "Student"("roll", "cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentSubject_assessment_id_subject_name_key" ON "AssessmentSubject"("assessment_id", "subject_name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTemplate_name_key" ON "PaymentTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_user_id_payment_request_id_key" ON "Payment"("user_id", "payment_request_id");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_class_teacher_id_fkey" FOREIGN KEY ("class_teacher_id") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentSubject" ADD CONSTRAINT "AssessmentSubject_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentSubject" ADD CONSTRAINT "AssessmentSubject_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTemplateField" ADD CONSTRAINT "PaymentTemplateField_payment_template_id_fkey" FOREIGN KEY ("payment_template_id") REFERENCES "PaymentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRequest" ADD CONSTRAINT "PaymentRequest_payment_template_id_fkey" FOREIGN KEY ("payment_template_id") REFERENCES "PaymentTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_request_id_fkey" FOREIGN KEY ("payment_request_id") REFERENCES "PaymentRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

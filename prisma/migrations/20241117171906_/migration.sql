-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'STAFF', 'DIRECTOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "NoticeTarget" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'STAFF', 'DIRECTOR', 'SUPER_ADMIN', 'PUBLIC', 'USER');

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
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED', 'TRANSFERRED', 'ON_LEAVE', 'DROPPED', 'PENDING', 'EXPELLED');

-- CreateEnum
CREATE TYPE "HRStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RETIRED', 'RESIGNED', 'TERMINATED', 'PROBATION', 'TRANSFERRED', 'PENDING');

-- CreateEnum
CREATE TYPE "RESIDENTIAL_STATUS" AS ENUM ('RESIDENTIAL', 'NON_RESIDENTIAL');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'CANCELED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AttendenceStatus" AS ENUM ('PRESENT', 'ABSENT', 'NO_DATA', 'LATE', 'BUNK');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('TEMP', 'ACTIVE');

-- CreateEnum
CREATE TYPE "PermissionStatus" AS ENUM ('GRANTED', 'REVOKED');

-- CreateEnum
CREATE TYPE "StaticPageStatus" AS ENUM ('PUBLIESHED', 'DRAFTS');

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
    "username" VARCHAR(32) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "role" "Role" NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(64),
    "avatar" VARCHAR(512),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "permission_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "permission_status" "PermissionStatus" NOT NULL DEFAULT 'GRANTED',

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "student_id" VARCHAR(32) NOT NULL,
    "full_name" VARCHAR(32) NOT NULL,
    "father_name" VARCHAR(32) NOT NULL,
    "mother_name" VARCHAR(32) NOT NULL,
    "guardian_phone" VARCHAR(11) NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "residential_status" "RESIDENTIAL_STATUS" NOT NULL DEFAULT 'NON_RESIDENTIAL',
    "student_status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "user_id" INTEGER NOT NULL,
    "cohort_id" INTEGER NOT NULL,
    "address_id" INTEGER,
    "roll" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFeedBack" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "StudentFeedBack_pkey" PRIMARY KEY ("id")
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
    "status" "HRStatus" NOT NULL DEFAULT 'ACTIVE',
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(32) NOT NULL,
    "description" TEXT,
    "status" "HRStatus" NOT NULL DEFAULT 'ACTIVE',
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Director" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(32) NOT NULL,
    "designation" VARCHAR(64) NOT NULL,
    "department" VARCHAR(64),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "HRStatus" NOT NULL DEFAULT 'ACTIVE',
    "address_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(32) NOT NULL,
    "designation" VARCHAR(64) NOT NULL,
    "department" VARCHAR(64),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "HRStatus" NOT NULL DEFAULT 'ACTIVE',
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" TEXT,
    "grade_id" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
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
CREATE TABLE "CohortSchedule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CohortStatus" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "CohortSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CohortTeacherSchedule" (
    "id" SERIAL NOT NULL,
    "course_name" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,
    "cohort_schedule_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "CohortTeacherSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttendence" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendenceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "StudentAttendence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAttendence" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendenceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "TeacherAttendence_pkey" PRIMARY KEY ("id")
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
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade_id" INTEGER NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSubject" (
    "id" SERIAL NOT NULL,
    "subject_name" VARCHAR(32) NOT NULL,
    "total_mark" INTEGER NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "teacher_id" INTEGER,
    "assessment_id" INTEGER NOT NULL,

    CONSTRAINT "AssessmentSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "student_id" INTEGER NOT NULL,
    "assessment_subject_id" INTEGER NOT NULL,
    "mark" INTEGER NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "remark" TEXT
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

-- CreateTable
CREATE TABLE "Payout" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" INTEGER NOT NULL,
    "user_id" INTEGER,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoticeCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "notice_target" "NoticeTarget" NOT NULL DEFAULT 'PUBLIC',
    "description" TEXT,

    CONSTRAINT "NoticeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "notice_category_id" INTEGER,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaticPage" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" VARCHAR(256) NOT NULL,
    "body" TEXT NOT NULL,
    "parent" TEXT,
    "status" "StaticPageStatus" NOT NULL DEFAULT 'DRAFTS',

    CONSTRAINT "StaticPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaticPageResource" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,

    CONSTRAINT "StaticPageResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "media_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MediaStatus" NOT NULL DEFAULT 'TEMP',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_permission_name_key" ON "Permission"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_user_id_permission_id_key" ON "UserPermission"("user_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_id_key" ON "Student"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_id_key" ON "Student"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_address_id_key" ON "Student"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_roll_cohort_id_key" ON "Student"("roll", "cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_user_id_key" ON "Teacher"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_address_id_key" ON "Teacher"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_id_key" ON "Admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_address_id_key" ON "Admin"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Director_address_id_key" ON "Director"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Director_user_id_key" ON "Director"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_user_id_key" ON "Staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_address_id_key" ON "Staff"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_name_key" ON "Grade"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_grade_id_key" ON "Course"("name", "grade_id");

-- CreateIndex
CREATE INDEX "Section_name_idx" ON "Section"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Section_grade_id_name_key" ON "Section"("grade_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_name_key" ON "Cohort"("name");

-- CreateIndex
CREATE INDEX "Cohort_section_id_name_idx" ON "Cohort"("section_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CohortSchedule_name_key" ON "CohortSchedule"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendence_date_student_id_key" ON "StudentAttendence"("date", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentSubject_assessment_id_subject_name_key" ON "AssessmentSubject"("assessment_id", "subject_name");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_student_id_assessment_subject_id_key" ON "AssessmentResult"("student_id", "assessment_subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTemplate_name_key" ON "PaymentTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_user_id_payment_request_id_key" ON "Payment"("user_id", "payment_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "NoticeCategory_name_key" ON "NoticeCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "StaticPage_parent_title_key" ON "StaticPage"("parent", "title");

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFeedBack" ADD CONSTRAINT "StudentFeedBack_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFeedBack" ADD CONSTRAINT "StudentFeedBack_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Director" ADD CONSTRAINT "Director_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Director" ADD CONSTRAINT "Director_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_class_teacher_id_fkey" FOREIGN KEY ("class_teacher_id") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortTeacherSchedule" ADD CONSTRAINT "CohortTeacherSchedule_cohort_schedule_id_fkey" FOREIGN KEY ("cohort_schedule_id") REFERENCES "CohortSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortTeacherSchedule" ADD CONSTRAINT "CohortTeacherSchedule_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendence" ADD CONSTRAINT "StudentAttendence_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAttendence" ADD CONSTRAINT "TeacherAttendence_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_notice_category_id_fkey" FOREIGN KEY ("notice_category_id") REFERENCES "NoticeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaticPageResource" ADD CONSTRAINT "StaticPageResource_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "StaticPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaticPageResource" ADD CONSTRAINT "StaticPageResource_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

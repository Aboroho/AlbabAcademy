-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Director" DROP CONSTRAINT "Director_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Director" DROP CONSTRAINT "Director_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_address_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentFeedBack" DROP CONSTRAINT "StudentFeedBack_student_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentFeedBack" DROP CONSTRAINT "StudentFeedBack_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_address_id_fkey";

-- AlterTable
ALTER TABLE "StudentFeedBack" ALTER COLUMN "student_id" DROP NOT NULL,
ALTER COLUMN "teacher_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFeedBack" ADD CONSTRAINT "StudentFeedBack_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFeedBack" ADD CONSTRAINT "StudentFeedBack_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Director" ADD CONSTRAINT "Director_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Director" ADD CONSTRAINT "Director_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_class_teacher_id_fkey";

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_class_teacher_id_fkey" FOREIGN KEY ("class_teacher_id") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

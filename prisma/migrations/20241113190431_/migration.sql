/*
  Warnings:

  - You are about to alter the column `date_of_joining` on the `teacher` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `assessment` MODIFY `description` TEXT NULL,
    MODIFY `creator_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `teacher` MODIFY `date_of_joining` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `Cohort_section_id_name_idx` ON `Cohort`(`section_id`, `name`);

-- CreateIndex
CREATE INDEX `Section_name_idx` ON `Section`(`name`);

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_class_teacher_id_fkey` FOREIGN KEY (`class_teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

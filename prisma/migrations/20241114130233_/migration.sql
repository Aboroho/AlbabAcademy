/*
  Warnings:

  - You are about to alter the column `date_of_joining` on the `teacher` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Made the column `section_id` on table `cohort` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cohort` DROP FOREIGN KEY `Cohort_section_id_fkey`;

-- AlterTable
ALTER TABLE `cohort` MODIFY `section_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacher` MODIFY `date_of_joining` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Cohort` ADD CONSTRAINT `Cohort_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

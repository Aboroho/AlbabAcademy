/*
  Warnings:

  - You are about to alter the column `date_of_joining` on the `teacher` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Made the column `address_id` on table `teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_address_id_fkey`;

-- AlterTable
ALTER TABLE `teacher` MODIFY `date_of_joining` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `address_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

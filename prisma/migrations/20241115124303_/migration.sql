/*
  Warnings:

  - The values [COMPLETED] on the enum `Payment_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `date_of_joining` on the `teacher` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('PROCESSING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PROCESSING';

-- AlterTable
ALTER TABLE `teacher` MODIFY `date_of_joining` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

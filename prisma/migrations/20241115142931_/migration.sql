/*
  Warnings:

  - You are about to alter the column `date_of_joining` on the `teacher` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Made the column `description` on table `paymenttemplatefield` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `paymenttemplatefield` MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teacher` MODIFY `date_of_joining` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

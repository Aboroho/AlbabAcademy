-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(12) NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `role` ENUM('STUDENT', 'TEACHER', 'ADMIN', 'STAFF', 'SUPER_ADMIN') NOT NULL,
    `phone` VARCHAR(11) NOT NULL,
    `email` VARCHAR(32) NULL,
    `avatar` VARCHAR(512) NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Grade_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `grade_id` INTEGER NOT NULL,
    `class_teacher_id` INTEGER NULL,

    UNIQUE INDEX `Section_grade_id_name_key`(`grade_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cohort` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `section_id` INTEGER NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL,

    UNIQUE INDEX `Cohort_name_key`(`name`),
    INDEX `Cohort_section_id_idx`(`section_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `district` VARCHAR(15) NULL,
    `sub_district` VARCHAR(15) NULL,
    `union` VARCHAR(15) NULL,
    `village` VARCHAR(15) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` VARCHAR(32) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `cohort_id` INTEGER NOT NULL,
    `roll` INTEGER NOT NULL,
    `full_name` VARCHAR(32) NOT NULL,
    `father_name` VARCHAR(32) NOT NULL,
    `mother_name` VARCHAR(32) NOT NULL,
    `guardian_phone` VARCHAR(11) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `date_of_birth` DATETIME(3) NOT NULL,
    `address_id` INTEGER NOT NULL,
    `residential_status` ENUM('RESIDENTIAL', 'NON_RESIDENTIAL') NOT NULL DEFAULT 'NON_RESIDENTIAL',

    UNIQUE INDEX `Student_student_id_key`(`student_id`),
    UNIQUE INDEX `Student_roll_cohort_id_key`(`roll`, `cohort_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `full_name` VARCHAR(32) NOT NULL,
    `designation` VARCHAR(32) NOT NULL,
    `description` VARCHAR(512) NULL,
    `subject_expertise` VARCHAR(128) NULL,
    `date_of_joining` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3),
    `qualification` VARCHAR(128) NULL,
    `address_id` INTEGER NULL,

    UNIQUE INDEX `Teacher_id_key`(`id`),
    UNIQUE INDEX `Teacher_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentType` (
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assessment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grade_id` INTEGER NOT NULL,
    `title` VARCHAR(128) NOT NULL,
    `description` VARCHAR(512) NULL,
    `assessment_type` VARCHAR(20) NULL,
    `date` DATETIME(3) NOT NULL,
    `result_date` DATETIME(3) NULL,
    `creator_id` INTEGER NOT NULL,
    `assessment_status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'GRADED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessment_id` INTEGER NOT NULL,
    `subject_name` VARCHAR(32) NOT NULL,
    `total_mark` INTEGER NOT NULL,
    `teacher_id` INTEGER NULL,

    UNIQUE INDEX `AssessmentSubject_assessment_id_subject_name_key`(`assessment_id`, `subject_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentTemplateField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `payment_template_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PaymentTemplate_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `forMonth` VARCHAR(32) NULL,
    `forYear` VARCHAR(32) NULL,
    `payment_template_id` INTEGER NOT NULL,
    `payment_target_type` ENUM('STUDENT', 'TEACHER', 'GRADE', 'SECTION', 'COHORT') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PROCESSING',
    `paymentMethod` ENUM('ONLINE', 'CASH') NOT NULL DEFAULT 'CASH',
    `user_id` INTEGER NOT NULL,
    `payment_request_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_user_id_payment_request_id_key`(`user_id`, `payment_request_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cohort` ADD CONSTRAINT `Cohort_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_cohort_id_fkey` FOREIGN KEY (`cohort_id`) REFERENCES `Cohort`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentSubject` ADD CONSTRAINT `AssessmentSubject_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentSubject` ADD CONSTRAINT `AssessmentSubject_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentTemplateField` ADD CONSTRAINT `PaymentTemplateField_payment_template_id_fkey` FOREIGN KEY (`payment_template_id`) REFERENCES `PaymentTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentRequest` ADD CONSTRAINT `PaymentRequest_payment_template_id_fkey` FOREIGN KEY (`payment_template_id`) REFERENCES `PaymentTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `PaymentRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `assets` on the `page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `page` DROP COLUMN `assets`,
    ADD COLUMN `metadata` JSON NULL;

-- CreateTable
CREATE TABLE `Component` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `html` VARCHAR(191) NOT NULL,
    `css` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Component_id_idx`(`id`),
    INDEX `Component_name_idx`(`name`),
    INDEX `Component_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

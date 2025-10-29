/*
  Warnings:

  - You are about to drop the column `linkListId` on the `link` table. All the data in the column will be lost.
  - You are about to drop the column `links` on the `section` table. All the data in the column will be lost.
  - You are about to drop the `linklist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sectionId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Link_linkListId_idx` ON `link`;

-- AlterTable
ALTER TABLE `link` DROP COLUMN `linkListId`,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `rel` VARCHAR(191) NULL,
    ADD COLUMN `sectionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `target` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `section` DROP COLUMN `links`;

-- DropTable
DROP TABLE `linklist`;

-- CreateIndex
CREATE INDEX `Link_sectionId_idx` ON `Link`(`sectionId`);

-- CreateIndex
CREATE INDEX `Link_order_idx` ON `Link`(`order`);

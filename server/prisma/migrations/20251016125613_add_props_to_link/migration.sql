-- AlterTable
ALTER TABLE `link` ADD COLUMN `parentId` VARCHAR(191) NULL,
    MODIFY `href` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `section` MODIFY `customHtml` TEXT NULL,
    MODIFY `customCss` TEXT NULL;

-- CreateIndex
CREATE INDEX `Link_parentId_idx` ON `Link`(`parentId`);

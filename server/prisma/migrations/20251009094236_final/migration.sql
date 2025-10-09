/*
  Warnings:

  - You are about to drop the column `js` on the `page` table. All the data in the column will be lost.
  - You are about to drop the `assets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assets` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `page` DROP COLUMN `js`,
    ADD COLUMN `assets` JSON NOT NULL;

-- DropTable
DROP TABLE `assets`;

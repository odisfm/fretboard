/*
  Warnings:

  - You are about to drop the column `order` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Shape` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Tuning` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scale" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Shape" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Tuning" DROP COLUMN "order";

/*
  Warnings:

  - You are about to drop the column `created_at` on the `ownership` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ownership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ownership" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "bought_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sold_at" TIMESTAMPTZ(6);

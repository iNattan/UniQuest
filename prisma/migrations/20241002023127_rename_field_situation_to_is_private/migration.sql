/*
  Warnings:

  - You are about to drop the column `situation` on the `teams` table. All the data in the column will be lost.
  - Added the required column `is_private` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teams" DROP COLUMN "situation",
ADD COLUMN     "is_private" INTEGER NOT NULL;

/*
  Warnings:

  - You are about to drop the column `final_registration` on the `competitions` table. All the data in the column will be lost.
  - Added the required column `end_registration` to the `competitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "competitions" DROP COLUMN "final_registration",
ADD COLUMN     "end_registration" TIMESTAMP(3) NOT NULL;

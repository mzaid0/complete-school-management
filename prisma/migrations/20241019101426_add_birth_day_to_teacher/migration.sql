/*
  Warnings:

  - You are about to drop the column `birthDay` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `birthDay` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "birthDay";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "birthDay";

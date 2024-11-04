/*
  Warnings:

  - Added the required column `birthDay` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDay` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "birthDay" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "birthDay" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - Added the required column `is_penalized` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "is_penalized" BOOLEAN NOT NULL;

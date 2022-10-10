/*
  Warnings:

  - You are about to drop the column `userCanBorrow` on the `Member` table. All the data in the column will be lost.
  - Added the required column `is_returned` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "userCanBorrow";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "is_returned" BOOLEAN NOT NULL;

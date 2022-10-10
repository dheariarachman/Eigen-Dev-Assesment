-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "borrow_date" DROP NOT NULL,
ALTER COLUMN "return_date" DROP NOT NULL;

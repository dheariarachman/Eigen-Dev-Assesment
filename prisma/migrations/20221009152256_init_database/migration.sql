-- CreateTable
CREATE TABLE "Member" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userCanBorrow" BOOLEAN NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Book" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "member_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "borrow_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_book_id_member_id_key" ON "Transaction"("book_id", "member_id");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

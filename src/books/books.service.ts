import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterStatus } from './entities/filter.entity';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({ data: createBookDto });
  }

  findAll(filter: FilterStatus) {
    const filterQueries: Prisma.BookWhereInput = {};

    switch (filter) {
      case FilterStatus.AVAILABLE:
        filterQueries.stock = {
          gte: 1,
        };
        break;

      case FilterStatus.BORROWED:
        filterQueries.stock = {
          equals: 0,
        };
        break;

      default:
        break;
    }
    return this.prisma.book.findMany({
      where: filterQueries,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.prisma.book.update({
      where: { code: id },
      data: updateBookDto,
    });
  }

  remove(id: string) {
    return this.prisma.book.delete({ where: { code: id } });
  }

  async borrowBook(memberId: string, bookId: string) {
    const borrowedBooks = await this.prisma.transaction.findMany({
      where: { member_id: memberId, is_returned: false },
    });

    const bookInStock = await this.prisma.book.findFirst({
      where: { code: bookId },
    });

    const isMemberBlocked = await this.prisma.member.findFirst({
      where: { code: memberId, is_penalized: true },
    });

    if (isMemberBlocked) {
      const penaltyDays = dayjs().diff(
        dayjs(isMemberBlocked.penalized_at),
        'day',
      );

      if (penaltyDays > 3) {
        await this.prisma.member.update({
          where: {
            code: memberId,
          },
          data: {
            is_penalized: false,
            penalized_at: null,
          },
        });
      }

      if (penaltyDays >= 3) {
        return `You are penalized, you can't borrow book for couple days`;
      }
    }

    // if (isMemberBlocked.is_penalized && penaltyDays > )

    if (bookInStock.stock <= 0) {
      return 'Book already borrowed';
    }

    if (borrowedBooks.some((v) => v.book_id === bookId)) {
      const date = borrowedBooks.find((v) => v.book_id === bookId);
      const dayJs = dayjs(date.borrow_date).add(3, 'days').format('DD/MM/YYYY');
      return 'You have to return this book at ' + dayJs;
    }

    if (borrowedBooks.length >= 2) {
      return 'Max Borrowed book : 2 Books';
    }

    const borrowedBook = await this.prisma.transaction.create({
      data: {
        book: {
          connect: {
            code: bookId,
          },
        },
        member: {
          connect: {
            code: memberId,
          },
        },
        is_returned: false,
        borrow_date: new Date().toISOString(),
      },
    });

    if (borrowedBook) {
      await this.prisma.book.update({
        where: { code: bookId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });
    }

    return (
      'You have to return this book at ' +
      dayjs(borrowedBook.borrow_date).add(3, 'days').format('DD/MM/YYYY')
    );
  }

  async returnBook(memberId: string, bookId: string) {
    let isUserPenalized = false;
    const checkIsCorrectBook = await this.prisma.transaction.findMany({
      where: {
        member_id: memberId,
      },
    });

    if (!checkIsCorrectBook.some((v) => v.book_id === bookId)) {
      return `You didn't borrow the book`;
    }

    const checkBorrowDate = await this.prisma.transaction.findFirst({
      where: { member_id: memberId, book_id: bookId },
    });

    const borrowDate = dayjs(checkBorrowDate.borrow_date);
    const today = dayjs();

    const diff = today.diff(borrowDate, 'day');

    if (diff > 3) {
      await this.prisma.member.update({
        where: { code: memberId },
        data: { is_penalized: true, penalized_at: new Date().toISOString() },
      });
      isUserPenalized = true;
    }

    await this.prisma.transaction.update({
      where: {
        book_id_member_id: {
          book_id: bookId,
          member_id: memberId,
        },
      },
      data: {
        is_returned: true,
        return_date: new Date().toISOString(),
      },
    });

    await this.prisma.book.update({
      where: { code: bookId },
      data: { stock: { increment: 1 } },
    });

    if (isUserPenalized) {
      return 'You are penalized';
    }

    return 'Book returned Successfully';
  }
}

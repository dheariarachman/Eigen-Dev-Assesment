import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import { FilterStatus } from './entities/filter.entity';

@Controller('books')
@ApiTags('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiCreatedResponse({ type: BookEntity })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiQuery({ name: 'filter', enum: FilterStatus })
  findAll(@Query('filter') filter: FilterStatus = FilterStatus.ALL) {
    return this.booksService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Post('/borrow-book')
  borrowBook(
    @Query('memberId') memberId: string,
    @Query('bookId') bookId: string,
  ) {
    return this.booksService.borrowBook(memberId, bookId);
  }

  @Post('/return-book')
  returnBook(
    @Query('memberId') memberId: string,
    @Query('bookId') bookId: string,
  ) {
    return this.booksService.returnBook(memberId, bookId);
  }
}

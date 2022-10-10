import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [PrismaModule, BooksModule, MembersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

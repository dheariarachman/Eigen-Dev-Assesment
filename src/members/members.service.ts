import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.member.findMany({
      select: {
        name: true,
        code: true,
        Transaction: true,
        _count: {
          select: {
            Transaction: {
              where: {
                is_returned: false,
              },
            },
          },
        },
      },
    });
  }
}

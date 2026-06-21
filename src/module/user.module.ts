import { Module } from '@nestjs/common';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';
import { UsersRepository } from '../repository/users.repository';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordResetRepository } from '../repository/password-reset.repository';
import { MailModule } from './mail.module';

@Module({
  imports: [MailModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PasswordResetRepository,
    PrismaService,
    UsersRepository,
  ],
})
export class UsersModule {}

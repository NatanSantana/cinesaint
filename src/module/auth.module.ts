import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../security/auth.service';
import { AuthController } from '../controller/auth.controller';
import { JwtStrategy } from '../security/jwt.strategy';
import { UsersModule } from '../module/user.module';
import { RolesGuard } from '../security/role.guard';
import { UsersRepository } from '../repository/users.repository';
import { PrismaService } from '../prisma/prisma.service';
import 'dotenv/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    UsersRepository,
    PrismaService,
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, RolesGuard],
})
export class AuthModule {}

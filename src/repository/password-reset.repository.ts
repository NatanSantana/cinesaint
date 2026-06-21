import { Injectable } from '@nestjs/common';
import { CreatePasswordResetDto } from '../DTO/create-password-reset.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PasswordResetRepository {
  constructor(private prisma: PrismaService) {}

  guardarToken(dto: CreatePasswordResetDto) {
    return this.prisma.resetPassword.create({
      data: {
        token: dto.token,
        email: dto.email,
        dataExpiracao: dto.dataExpiracao,
      },
    });
  }

  buscarToken(token: string) {
    return this.prisma.resetPassword.findFirst({
      where: {
        token: token,
      },
    });
  }

  deletarToken(token: string) {
    return this.prisma.resetPassword.delete({
      where: {
        token: token,
      },
    });
  }
}

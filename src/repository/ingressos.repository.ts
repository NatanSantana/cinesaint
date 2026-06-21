import { Injectable } from '@nestjs/common';
import { IngressoDto } from '../DTO/create-ingresso.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngressosRepository {
  constructor(private prisma: PrismaService) {}

  registrarIngresso(ingresso: IngressoDto) {
    return this.prisma.ingressos.create({
      data: ingresso,
    });
  }

  buscarIngressoById(id: number) {
    return this.prisma.ingressos.findUnique({
      where: {
        idIngresso: id,
      },
    });
  }
}

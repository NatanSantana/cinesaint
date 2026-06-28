import { createAssentosOcupados } from '../DTO/create-assentos-ocupados.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
@Injectable()
export class AssentosOcupadosRepository {
  constructor(private prismaService: PrismaService) {}

  async excluirAssentosOcupados(idSessao: number[]) {
    return await this.prismaService.assentosOcupados.deleteMany({
      where: { idSessao: { in: idSessao } },
    });
  }

  async registrarAssentoOcupado(tx: Prisma.TransactionClient, assentoOcupado: createAssentosOcupados) {
    return await tx.assentosOcupados.create({
      data: assentoOcupado,
    });
  }

  async isAssentoOcupado(
    idAssento: number,
    idSessao: number,
  ): Promise<boolean> {
    const busca = await this.prismaService.assentosOcupados.findFirst({
      where: {
        AND: [{ idAssento: idAssento }, { idSessao: idSessao }],
      },
    });

    if (busca) {
      return true;
    } else {
      return false;
    }
  }
}

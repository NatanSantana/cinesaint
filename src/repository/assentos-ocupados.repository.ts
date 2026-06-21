import { createAssentosOcupados } from '../DTO/create-assentos-ocupados.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssentosOcupadosRepository {
  constructor(private prismaService: PrismaService) {}

  async excluirAssentosOcupados(idSessao: number[]) {
    return await this.prismaService.assentosOcupados.deleteMany({
      where: { idSessao: { in: idSessao } },
    });
  }

  async registrarAssento(assentoOcupado: createAssentosOcupados) {
    return await this.prismaService.assentosOcupados.create({
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

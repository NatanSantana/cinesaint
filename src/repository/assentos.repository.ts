import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssentosDto } from '../DTO/create-assentos.dto';

@Injectable()
export class AssentosRepository {
  constructor(private prisma: PrismaService) {}

  registrarAssentos(assentos: CreateAssentosDto) {
    return this.prisma.assentos.create({
      data: assentos,
    });
  }

  async atualizarAssentosComoManutencao(identificacao: string) {
    return await this.prisma.assentos.update({
      where: { identificacao: identificacao },
      data: { statusCadeira: 'MANUTENCAO' },
    });
  }

  async atualizarAssentosComoLivre(identificacao: string) {
    return await this.prisma.assentos.updateMany({
      where: {
        AND: [
          { identificacao: identificacao },
          { statusCadeira: 'MANUTENCAO' },
        ],
      },
      data: { statusCadeira: 'LIVRE' },
    });
  }

  allAssentosByIdSala(idSala: number) {
    return this.prisma.assentos.findMany({
      where: {
        idSala: idSala,
      },
    });
  }

  buscarAssentosById(id: number[]) {
    return this.prisma.assentos.findMany({
      where: {
        idAssentos: {
          in: id,
        },
      },
    });
  }

  async buscarAssentosByIdentificacao(identificacao: string) {
    return await this.prisma.assentos.findFirst({
      where: { identificacao: identificacao },
    });
  }

  async buscarAssentosLivresById(id: number[]) {
    return await this.prisma.assentos.findMany({
      where: {
        idAssentos: {
          in: id,
        },
        statusCadeira: 'LIVRE',
      },
    });
  }

  qtdeAssentosByIdSala(idSala: number): Promise<number> {
    return this.prisma.assentos.count({
      where: {
        idSala: idSala,
      },
    });
  }
}

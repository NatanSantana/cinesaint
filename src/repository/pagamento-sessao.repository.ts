import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PagamentoSessaoDto } from '../DTO/pagamento-sessao.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PagamentoSessaoRepository {
  constructor(private prisma: PrismaService) {}

  registrarPagamentoSessao(
    tx: Prisma.TransactionClient,
    pagamento: PagamentoSessaoDto,
    idAssento: number,
    idIngresso: number,
  ) {
    return tx.ingressosComprados.create({
      data: {
        idSala: pagamento.idSala,
        idFilme: pagamento.idFilme,
        idSessao: pagamento.idSessao,
        idIngresso: idIngresso,
        idAssento: idAssento,
        cpf: pagamento.cpfCliente,
        status: 'VALIDO',
      },
    });
  }

  utilizarIngresso(cpf: string) {
    return this.prisma.ingressosComprados.updateMany({
      where: {
        cpf: cpf
      },
      data: {
        status: "UTILIZADO"
      }
    })
  }

  async buscarIngressoByCpf(cpf: string) {
    return await this.prisma.ingressosComprados.findMany({
      select: {
        idIngressoComprado: true,
      },
      where: { cpf: cpf },
    });
  }

  buscarIngressoCompradoByCpf(cpf: string) {
    return this.prisma.ingressosComprados.findMany({
      select: {
        idIngressoComprado: true,
        status: true,
        filme: {
          select: {
            nome: true,
            minutosFilme: true,
          },
        },
        sessoes: {
          select: {
            dataSessao: true,
          },
        },
        sala: {
          select: {
            numero: true,
            tierSala: true,
          },
        },
      },
      where: { cpf: cpf },
    });
  }
}

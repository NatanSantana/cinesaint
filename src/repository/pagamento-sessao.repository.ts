import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PagamentoSessaoDto } from '../DTO/pagamento-sessao.dto';

@Injectable()
export class PagamentoSessaoRepository {
  constructor(private prisma: PrismaService) {}

  registrarPagamentoSessao(pagamento: PagamentoSessaoDto, idAssento: number) {
    return this.prisma.ingressosComprados.create({
      data: {
        idSala: pagamento.idSala,
        idFilme: pagamento.idFilme,
        idSessao: pagamento.idSessao,
        idIngresso: pagamento.idIngresso,
        idAssento: idAssento,
        cpf: pagamento.cpfCliente,
        status: 'VALIDO',
      },
    });
  }

  async buscarIngressoByCpf(cpf: string) {
    return await this.prisma.ingressosComprados.findMany({
      select: {
        idIngressoComprado: true,
      },
      where: { cpf: cpf },
    });
  }

  buscarIngressoCompradoById(id: number) {
    return this.prisma.ingressosComprados.findUnique({
      select: {
        idIngressoComprado: true,
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
      where: { idIngressoComprado: id },
    });
  }
}

import { Module } from '@nestjs/common';
import { SessaoController } from '../controller/sessao.controller';
import { SessaoService } from '../service/sessao.service';
import { SessaoRepository } from '../repository/sessao.repository';
import { SalasRepository } from '../repository/salas.repository';
import { FilmeRepository } from '../repository/filme.repository';
import { AssentosRepository } from '../repository/assentos.repository';
import { PagamentoSessaoRepository } from '../repository/pagamento-sessao.repository';
import { IngressosRepository } from '../repository/ingressos.repository';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SessaoController],
  providers: [
    SessaoService,
    SessaoRepository,
    SalasRepository,
    FilmeRepository,
    AssentosRepository,
    PagamentoSessaoRepository,
    IngressosRepository,
    PrismaService,
  ],
})
export class SessaoModule {}
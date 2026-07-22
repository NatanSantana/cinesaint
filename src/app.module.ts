import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilmeController } from './controller/filme.controller';
import { FilmesService } from './service/filmes.service';
import { PrismaService } from './prisma/prisma.service';
import { FilmeRepository } from './repository/filme.repository';
import { SalasController } from './controller/salas.controller';
import { SalasRepository } from './repository/salas.repository';
import { SalasService } from './service/salas.service';
import { SessaoService } from './service/sessao.service';
import { SessaoRepository } from './repository/sessao.repository';
import { AssentosController } from './controller/assentos.controller';
import { AssentosRepository } from './repository/assentos.repository';
import { AssentosService } from './service/assentos.service';
import { IngressosRepository } from './repository/ingressos.repository';
import { IngressoService } from './service/ingresso.service';
import { PagamentoSessaoRepository } from './repository/pagamento-sessao.repository';
import { UsersModule } from './module/user.module';
import { AuthModule } from './module/auth.module';
import { SessaoModule } from './module/sessao.module';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from './repository/users.repository';
import { AssentosOcupadosRepository } from './repository/assentos-ocupados.repository';
import { MercadoPagoController } from './controller/mercadopago.controller';
import { ProdutosService } from './service/produtos.service';
import { ProdutosRepository } from './repository/produtos.repository';
import { ProdutosController } from './controller/produto.controller';
import { PaymentRefund } from 'mercadopago';
import { ComentariosRepository } from './repository/comentarios.repository';
import { ComentariosService } from './service/comentarios.service';
import { NotasRepository } from './repository/notas-repository';
import { NotasService } from './service/notas.service';
import { ComentariosController } from './controller/comentarios.controller';
import { NotasController } from './controller/notas.controller';
import { RedisModule } from './module/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    SessaoModule,
    RedisModule
  ],
  controllers: [
    AppController,
    FilmeController,
    SalasController,
    AssentosController,
    MercadoPagoController,
    ProdutosController,
    NotasController,
    ComentariosController
  ],

  providers: [
    AppService,
    FilmesService,
    PrismaService,
    FilmeRepository,
    SalasService,
    SalasRepository,
    SessaoService,
    SessaoRepository,
    AssentosService,
    AssentosRepository,
    IngressosRepository,
    IngressoService,
    PagamentoSessaoRepository,
    UsersRepository,
    AssentosOcupadosRepository,
    ProdutosService,
    ProdutosRepository,
    PaymentRefund,
    ComentariosRepository,
    ComentariosService,
    NotasRepository,
    NotasService,
    ComentariosRepository,
    ComentariosService
  ],
})
export class AppModule {}

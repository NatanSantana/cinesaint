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
import { SessaoController } from './controller/sessao.controller';
import { SessaoService } from './service/sessao.service';
import { SessaoRepository } from './repository/sessao.repository';
import { AssentosController } from './controller/assentos.controller';
import { AssentosRepository } from './repository/assentos.repository';
import { AssentosService } from './service/assentos.service';

@Module({
  imports: [],
  controllers: [
    AppController, 
    FilmeController, 
    SalasController, 
    SessaoController,
    AssentosController ],

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
    AssentosRepository
  ],
})
export class AppModule {}

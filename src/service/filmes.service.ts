import { Injectable } from '@nestjs/common';
import { CreateFilmeDto } from '../DTO/create-filme.dto';
import { FilmeRepository } from '../repository/filme.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { REDIS_CLIENT } from '../module/redis.constantes';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class FilmesService {
  constructor(
    private prisma: PrismaService,
    private filmeRepository: FilmeRepository,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis
  ) {}

  async cadastrarFilme(filme: CreateFilmeDto) {
    const filmeExistente = await this.filmeRepository.searchByNome(filme.nome);

    if (filmeExistente !== null) {
      throw new ConflictException(
        'Já existe um filme cadastrado com esse nome',
      );
    }

    return await this.filmeRepository.create(filme);
  }

  async listarFilmes() {
  const cache = await this.redisClient.get('cache:filmes');

  if (cache) {
    console.log("usou cache")
    return JSON.parse(cache); 
  }

  const filmes = await this.filmeRepository.findAll();
  console.log("Não usou cache")
  await this.redisClient.set('cache:filmes', JSON.stringify(filmes), 'EX', 10); 
  return filmes;
}
}

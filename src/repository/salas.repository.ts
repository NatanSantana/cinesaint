import { Injectable } from '@nestjs/common';
import { CreateSalaDto } from '../DTO/create-sala.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalasRepository {
  constructor(private prisma: PrismaService) {}

  async create(sala: CreateSalaDto) {
    return await this.prisma.salas.create({
      data: sala,
    });
  }

  async findAll() {
    return await this.prisma.salas.findMany();
  }

  async searchById(id: number) {
    return await this.prisma.salas.findUnique({
      where: {
        idSalas: id,
      },
    });
  }

  async searchByNumero(numero: number) {
    return await this.prisma.salas.findUnique({
      where: {
        numero: numero,
      },
    });
  }
}

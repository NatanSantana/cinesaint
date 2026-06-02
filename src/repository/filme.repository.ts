import { Injectable } from "@nestjs/common";
import { CreateFilmeDto } from "../DTO/create-filme.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FilmeRepository {
    constructor(private prisma: PrismaService) { }

    async create(filme: CreateFilmeDto) {
        return await this.prisma.filme.create({
            data: filme
        });
    }

    async searchByNome(nome: string) {
        return await this.prisma.filme.findUnique({ where: {nome} });
    }

    async searchById(id: number) {
        return await this.prisma.filme.findUnique({ where: {idFilme: id} });
    }

    async findAll() {
        return await this.prisma.filme.findMany();
    }




}
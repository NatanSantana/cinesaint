import { Injectable } from "@nestjs/common";
import { CreateFilmeDto } from "../DTO/create-filme.dto";
import { FilmeRepository } from "../repository/filme.repository";
import { PrismaService } from "../prisma/prisma.service";
import { ConflictException } from "@nestjs/common/exceptions/conflict.exception";




@Injectable()
export class FilmesService {

    constructor(private prisma: PrismaService,
        private filmeRepository: FilmeRepository
    ) { }

    async cadastrarFilme(filme: CreateFilmeDto) {

        const filmeExistente = await this.filmeRepository.searchByNome(filme.nome)

        if (filmeExistente !== null) {
            throw new ConflictException('Já existe um filme cadastrado com esse nome!')
        }
        
        return await this.filmeRepository.create(filme);
        

    }

    async listarFilmes() {
        return await this.filmeRepository.findAll();
    }



}
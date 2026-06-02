import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSalaDto } from "../DTO/create-sala.dto";
import { SalasRepository } from "../repository/salas.repository";
import { Tiers } from "../enum/tiers.enum";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { ConflictException } from "@nestjs/common/exceptions/conflict.exception";


@Injectable()
export class SalasService {

    constructor(private prisma: PrismaService, private salasRepository: SalasRepository) {}


    async cadastrarSala(sala: CreateSalaDto) {

        const salaExistente = await this.salasRepository.searchByNumero(sala.numero)

        if (salaExistente !== null) {
            throw new ConflictException('Já existe uma sala cadastrada com esse número!')
        }


        if (!Object.values(Tiers).includes(sala.tierSala)) {
            throw new BadRequestException("Tier inválido");
        }

        return this.salasRepository.create(sala);

    }

    async listarSalas() {
        return this.salasRepository.findAll();
    }

    async buscarSalaPorNumero(numero: number) {
        if (typeof numero !== "number") {
            throw new BadRequestException("Número da sala deve ser um número inteiro");
        }

        if (numero < 1) {
            throw new BadRequestException("Número da sala deve ser um número inteiro positivo");
        }


        const sala = await this.salasRepository.searchByNumero(numero);
        if (!sala) {
            throw new BadRequestException('Sala não encontrada');
        }

        return sala;
    }


}
import { Injectable } from "@nestjs/common";
import { CreateAssentosDto } from "../DTO/create-assentos.dto";
import { AssentosRepository } from "../repository/assentos.repository";
import { SalasRepository } from "../repository/salas.repository";
import { BadRequestException } from "@nestjs/common/exceptions";

@Injectable()
export class AssentosService {
    constructor(private assentosRepository: AssentosRepository, 
        private salaRepository: SalasRepository) { }

    async registrarAssentos(assentos: CreateAssentosDto) {
        
        const sala = await this.salaRepository.searchById(assentos.idSala);

        if (!sala) {
            throw new BadRequestException("Sala não encontrada");
        }

        const assentosRegistrados = await this.assentosRepository.qtdeAssentosByIdSala(assentos.idSala);

        if (assentosRegistrados > sala.qtdeLimiteAssentos) {
            throw new BadRequestException("Capacidade máxima de assentos atingida para esta sala, não será possível registrar mais assentos");
        }

        return await this.assentosRepository.registrarAssentos(assentos);
    }

    async assentosByIdSala(idSala: number) {
        return await this.assentosRepository.assentosByIdSala(idSala);
    }


}
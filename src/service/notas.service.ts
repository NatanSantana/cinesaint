import { Injectable } from "@nestjs/common";
import { NotasRepository } from "../repository/notas-repository";
import { CreateNotaFilmeDto } from "../DTO/create-nota-filme.dto";
import { BadRequestException } from "@nestjs/common/exceptions";

@Injectable()
export class NotasService {

    constructor(private notasRepository: NotasRepository) {}

    async adicionarNotaFilme(notaDto: CreateNotaFilmeDto) {

        const isNotaValida = notaDto.nota * 10 % 5;

        if (isNotaValida !== 0) {
            throw new BadRequestException('A nota deve seguir este padrão: (Ex: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)');
        }

        await this.notasRepository.lancarNota(notaDto);
    }


}
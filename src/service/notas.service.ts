import { Injectable } from "@nestjs/common";
import { NotasRepository } from "../repository/notas-repository";
import { CreateNotaFilmeDto } from "../DTO/create-nota-filme.dto";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common/exceptions";
import { UsersRepository } from "../repository/users.repository";
import { FilmeRepository } from "../repository/filme.repository";

@Injectable()
export class NotasService {

    constructor(private notasRepository: NotasRepository,
                private usersRepository: UsersRepository,
                private filmesRepository: FilmeRepository
    ) {}

    async adicionarNotaFilme(notaDto: CreateNotaFilmeDto) {

        const user = await this.usersRepository.findById(notaDto.idUsuario);

        if(!user) throw new NotFoundException("Não existe usuário com esse id")

        const filme = await this.filmesRepository.findById(notaDto.idFilme);

        if(!filme) throw new NotFoundException("Não existe filme com esse id")

        // transforma o decimal em inteiro para verificar se ele é múltiplo de 5
        const isNotaValida = notaDto.nota * 10 % 5;

        if (isNotaValida !== 0) {
            throw new BadRequestException('A nota deve seguir este padrão: (Ex: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)');
        }

        if (await this.notasRepository.isNotaAdicionada(notaDto.idFilme, notaDto.idUsuario)) throw new ConflictException("O usuário já adicionou uma nota para esse filme")

        return await this.notasRepository.lancarNota(notaDto);
    }


    async retirarNota(idFilme: number, idUsuario: number) {
        const notaPublicada = await this.notasRepository.excluirNota(idFilme, idUsuario);

        if(!notaPublicada) throw new NotFoundException("Não foi possível encontrar a nota publicada, por favor verifique o idFilme e o idUsuario");
        
        return true;
    }
}
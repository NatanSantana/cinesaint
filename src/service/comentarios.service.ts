import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateComentariosFilmes } from "../DTO/create-comentarios-dto";
import { ComentariosRepository } from "../repository/comentarios.repository";
import { FilmeRepository } from "../repository/filme.repository";
import { UsersRepository } from "../repository/users.repository";

@Injectable()
export class ComentariosService {
    constructor(private comentariosRepository: ComentariosRepository,
                private filmeRepository: FilmeRepository,
                private userRepository: UsersRepository
    ) {}

    async registrarComentario(dto: CreateComentariosFilmes) {

        if(await this.comentariosRepository.isComentarioDuplicado(dto.idFilme, dto.idUsuario)) 
            throw new ConflictException("Um usuário só pode ter um comentário por filme")

        const filme = await this.filmeRepository.findById(dto.idFilme);
        if(!filme) throw new NotFoundException("Não existe filme com esse ID");

        const user = await this.userRepository.findById(dto.idUsuario)
        if(!user) throw new NotFoundException("Não existe filme com esse ID");

        
        return this.comentariosRepository.registrarComentario(dto);
    }

    async deletarComentario(idFilme: number, idUsuario: number) {
        const comentarioDeletado = await this.comentariosRepository.deletarComentario(idFilme, idUsuario);

        if (comentarioDeletado.count === 0) 
            throw new NotFoundException("Não foi possível encontrar o comentário");

        return
    }


} 
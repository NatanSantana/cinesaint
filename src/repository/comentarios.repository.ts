import { Injectable } from "@nestjs/common";
import { CreateComentariosFilmes } from "../DTO/create-comentarios-dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ComentariosRepository {
    constructor(private prisma: PrismaService) {}

    registrarComentario(dto: CreateComentariosFilmes) {
        return this.prisma.comentariosFilme.create({
            data: dto
        })
    }

    async isComentarioDuplicado(idFilme: number, idUsuario: number) {
        const comentario =  await this.prisma.comentariosFilme.findFirst({
            select: {id: true},
            where: {
                idFilme: idFilme,
                idUsuario: idUsuario
            }
        })

        if (comentario) {
            return true;
        } else {
            return false;
        }

    }

    deletarComentario(idFilme: number, idUsuario: number) {
        return this.prisma.comentariosFilme.deleteMany({
            where: {
                idFilme: idFilme,
                idUsuario: idUsuario
            }
        })
    }

}
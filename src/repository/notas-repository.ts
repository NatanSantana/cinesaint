import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotaFilmeDto } from "../DTO/create-nota-filme.dto";

@Injectable()
export class NotasRepository {
    constructor(private prisma: PrismaService) {}

    findByIdFilme(idFilme: number) {
        return this.prisma.notasFilme.findMany({
            where: {
                idFilme: idFilme
            }
        })
    }


    lancarNota(notaDto: CreateNotaFilmeDto) {
        return this.prisma.notasFilme.create({
            data: notaDto
        })
    }

    excluirNota(idFilme: number, idUsuario: number) {
        return this.prisma.notasFilme.deleteMany({
            where: {
                AND: [
                    {idFilme: idFilme},
                    {idUsuario: idUsuario}
                ]
            }
        })
    }

    isNotaAdicionada(idFilme: number, idUsuario: number) {
        return this.prisma.notasFilme.findFirst({
            select: {
                id: true
            },
            where: {
                idUsuario: idUsuario,
                idFilme: idFilme
            }
        })
    }


}
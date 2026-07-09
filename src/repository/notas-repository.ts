import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotaFilmeDto } from "../DTO/create-nota-filme.dto";

@Injectable()
export class NotasRepository {
    constructor(private prisma: PrismaService) {}


    lancarNota(notaDto: CreateNotaFilmeDto) {
        return this.prisma.notasFilme.create({
            data: notaDto
        })
    }


}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSessaoDto } from "../DTO/create-sessao.dto";
import { StatusSessao } from "../enum/status-sessao.enum";

@Injectable()
export class SessaoRepository {

    constructor(private prisma: PrismaService) { }


    inativarSessoes(idSessoes: number[]) {
    return this.prisma.sessao.updateMany({
        where: {
            AND: [
                {idSessao: { in: idSessoes } },
                {dataSessao: { lt: new Date()}}
            ] },
        data: { statusSessao: "INATIVO" }
    });
}



    criarSessao(sessao: CreateSessaoDto) {
        return this.prisma.sessao.create({
            data: sessao
        });

    }

    buscarSessaoById(id: number) {
        return this.prisma.sessao.findUnique({
            where: {
                idSessao: id
            }
        });
    }

    listarAllSessoes() {
        return this.prisma.sessao.findMany();
    }

    listarSessoesByIdFilme(idFilme: number) {
        return this.prisma.sessao.findMany({
            where: {
                idFilme: idFilme
            }
        });
    }

    listarSessoesByIdSala(idSala: number) {
    return this.prisma.sessao.findMany({
        select: {
            dataSessao: true,
            idFilme: true,
            idSala: true,
            filme: {
                select: {
                    minutosFilme: true
                }
            }
        },
        where: {
            idSala: idSala
        }
    });
}
        

}
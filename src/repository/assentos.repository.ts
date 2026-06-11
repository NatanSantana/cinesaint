import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAssentosDto } from "../DTO/create-assentos.dto";

@Injectable()
export class AssentosRepository {
    constructor(private prisma: PrismaService) { }

    registrarAssentos(assentos: CreateAssentosDto) {
        return this.prisma.assentos.create({
            data: assentos
        });
    }

    

    allAssentosByIdSala(idSala: number) {
        return this.prisma.assentos.findMany({
            where: {
                idSala: idSala
            }
        });
    }

    buscarAssentosById(id: number[]) {
        return this.prisma.assentos.findMany({
            where: {
                idAssentos: {
                    in: id
                }
            }
        });
    }

    async buscarAssentosLivresById(id: number[]) {
        return await this.prisma.assentos.findMany({
            where: {
                idAssentos: {
                    in: id
                },
                statusCadeira: "LIVRE"
            }
        });
    }

    async atualizarAssentoParaOcupado(idAssento: number) {
    return await this.prisma.assentos.update({
        where: { idAssentos: idAssento },
        data: { statusCadeira: "OCUPADA" }
            }).catch(err => console.error("Erro ao atualizar assento:", err));
        }

    qtdeAssentosByIdSala(idSala: number): Promise<number> {
        return this.prisma.assentos.count({
            where: {
                idSala: idSala
            }
        });
    }


}
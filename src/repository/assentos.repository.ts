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

    assentosByIdSala(idSala: number) {
        return this.prisma.assentos.findMany({
            where: {
                idSala: idSala
            }
        });
    }

    qtdeAssentosByIdSala(idSala: number): Promise<number> {
        return this.prisma.assentos.count({
            where: {
                idSala: idSala
            }
        });
    }


}
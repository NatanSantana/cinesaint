import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "../DTO/create-user.dto";


@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) { }
    
    async findByEmail(email: string) {
        return await this.prisma.users.findUnique({
            where: {
                email: email
            }
        });
    }

    async findByCpf(cpf: string) {
        return await this.prisma.users.findUnique({
            where: {
                cpf: cpf
            }
        });
    }

    async isEmailExist(email: string): Promise<boolean> {
        const emailAchado = await this.prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (emailAchado) {
            return true;
        } else {
            return false;
        }



    }

    async isCpfExist(cpf: string): Promise<boolean> {
        const cpfAchado = await this.prisma.users.findUnique({
            where: {
                cpf: cpf
            }
        });

        if (cpfAchado) {
            return true;
        } else {
            return false;
        }

    }

    async criarUser(user: CreateUserDto) {
        return await this.prisma.users.create({
            data: user
        });
    }


}
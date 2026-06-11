import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../DTO/create-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Roles } from '../enum/role.enum'

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) { }

    private async hashPassword(senha: string) {
        if (!senha) {
            throw new Error('O campo de senha não pode ser null');
        }

        const saltRounds = 10;
        return await bcrypt.hash(senha, saltRounds);
    }

    async criarUser(user: CreateUserDto) {
        
        const [existingEmail, existingCpf] = await Promise.all([
            this.usersRepository.isEmailExist(user.email),
            this.usersRepository.isCpfExist(user.cpf)
        ]);


        if (existingEmail || existingCpf) {
            throw new ConflictException('Usuário já existente');
        }

        if (!Object.values(Roles).includes(user.role)) {
            throw new BadRequestException("Role inválida")
        }

        const hashedPassword = await this.hashPassword(user.senha);
        const userValidado = user
        userValidado.senha = hashedPassword;
        await this.usersRepository.criarUser(user);
        return "Usuário Criado"


    }



}
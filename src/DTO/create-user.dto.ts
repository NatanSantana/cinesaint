import { IsEmail, IsNotEmpty, IsString, IsDate } from "class-validator";
import { Roles } from '../enum/role.enum'

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    nome: string

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    senha: string

    @IsNotEmpty()
    @IsString()
    cpf: string

    @IsNotEmpty()
    @IsDate()
    dataNascimento: Date

    @IsNotEmpty()
    role: Roles

    constructor(nome: string, email: string, senha: string, cpf: string, dataNascimento: Date, role: Roles) {
        this.nome = nome
        this.email = email
        this.senha = senha
        this.cpf = cpf
        this.dataNascimento = dataNascimento
        this.role = role
    }

}
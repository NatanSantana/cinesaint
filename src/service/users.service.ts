import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../DTO/create-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Roles } from '../enum/role.enum'
import { PasswordResetRepository } from '../repository/password-reset.repository';
import { nanoid } from 'nanoid'
import { CreatePasswordResetDto } from '../DTO/create-password-reset.dto';
import { addMinutes, isAfter } from 'date-fns';
import { ResetPasswordDto } from '../DTO/create-reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer'
import { Subject } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository, 
        private resetPassword: PasswordResetRepository,
    private mailerService: MailerService) { }

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

    async gerarTokenResetPassword(email: string) {
        if (!email) {
            throw new BadRequestException("O email não pode ser null")
        }

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException("Não foi possível encontrar um usuário")
        }

        const token = new CreatePasswordResetDto(nanoid(5), email, addMinutes(new Date(), 15))
        await this.resetPassword.guardarToken(token);
        await this.mailerService.sendMail({
            to: email,
            subject: "Redefinição de Senha",
            text: "Utilize esse token para redefinir sua senha: " + token.token
        });
        return "email enviado"
    }

    async validarToken(dto: ResetPasswordDto) {
        if (!dto.token || !dto.email || !dto.novaSenha) {
            throw new BadRequestException("Todos os campos devem ser preenchidos")
        }

        const tokenResgatado = await this.resetPassword.buscarToken(dto.token);

        if (!tokenResgatado) {
            throw new NotFoundException("Não foi possível encontrar o token")
        }

        if (isAfter(new Date(), tokenResgatado.dataExpiracao)) {
            throw new UnauthorizedException("Token expirado")
        }

        const senhaHashed = await this.hashPassword(dto.novaSenha);

        await this.usersRepository.trocarSenha(senhaHashed, dto.email);

        await this.resetPassword.deletarToken(dto.token);

        return "senha alterada";
        
    }





}
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    if (
      !email.endsWith('@gmail.com') &&
      !email.endsWith('@hotmail.com') &&
      !email.endsWith('@outlook.com')
    ) {
      throw new BadRequestException('O email enviado não é válido');
    }

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!(await bcrypt.compare(senha, user.senha))) {
      throw new UnauthorizedException('Email ou Senha Inválidos');
    }

    const payload = { sub: user.idUser, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}

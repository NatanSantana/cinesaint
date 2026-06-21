import { Body, Controller } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../DTO/create-user.dto';
import { Post } from '@nestjs/common';
import { ResetPasswordDto } from '../DTO/create-reset-password.dto';

@Controller('/user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async cadastrar(@Body() user: CreateUserDto) {
    return await this.userService.criarUser(user);
  }

  @Post('/esqueci-senha')
  async gerarTokenEsqueciASenha(@Body() body: { email: string }) {
    return await this.userService.gerarTokenResetPassword(body.email);
  }

  @Post('/validar-token')
  async validarToken(@Body() reset: ResetPasswordDto) {
    return await this.userService.validarToken(reset);
  }
}

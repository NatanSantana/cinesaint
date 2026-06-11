import { Body, Controller } from "@nestjs/common";
import { UsersService } from "../service/users.service";
import { CreateUserDto } from "../DTO/create-user.dto";
import { Post } from "@nestjs/common";

@Controller('/user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post()
    async cadastrar(@Body() user: CreateUserDto) {
        return await this.userService.criarUser(user);

    }

}
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth-dto';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('create')
    async create(@Body() createAuthDto: CreateAuthDto) {
        return this.authService.SignupUsers(createAuthDto);
    }

    @Post('sign-in')
    async LoginUser(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return this.authService.LoginUser(email, password);
    }

    @Get('res')
    async Request() {
        return this.authService.Response()
    }

    @Put(':id')
    async turnUserLoginToTrue(
        @Param('id') id: string,
        @Body() body: { login: boolean }
    ) {
        const { login } = body;
        return this.authService.turnUserLoginToTrue(id, login);
    }

    @Get('search')
    async searchField(@Query() query: SearchUserDto) {
        return this.authService.searchParameter(query);
    }

}

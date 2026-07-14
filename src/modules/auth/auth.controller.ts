import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    // POST
    @Post('register')
    register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(
        @Body() loginDto: LoginDto,
    ) {
        return this.authService.login(
            loginDto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(
        @GetUser() user: JwtPayload,
    ) {
        return user;
    }
}
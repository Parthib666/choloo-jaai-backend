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
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { JwtAccessPayload } from './interfaces/jwt-access-payload.interface';
import { LogoutDto } from './dto/logout.dto';



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

    @Post('refresh')
refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
) {
    return this.authService.refresh(
        refreshTokenDto,
    );
}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(
        @GetUser() user: JwtAccessPayload,
    ) {
        return user;
    }

    @Post('logout')
logout(
    @Body() logoutDto: LogoutDto,
) {
    return this.authService.logout(
        logoutDto,
    );
}
}
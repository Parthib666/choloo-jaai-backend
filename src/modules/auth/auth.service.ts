import {
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserMapper } from '../users/mappers/user.mapper';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(
        registerDto: RegisterDto,
    ) {
        const passwordHash = await bcrypt.hash(
            registerDto.password,
            10,
        );

        const createUserDto: CreateUserDto = {
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            email: registerDto.email,
            phone: registerDto.phone,
            passwordHash,
        };

        return this.usersService.create(
            createUserDto,
        );
    }

    async validateUser(
        email: string,
        password: string,
    ) {
        const user = await this.usersService.findByEmail(
            email,
        );

        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.passwordHash,
            );

        if (!isPasswordValid) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        return user;
    }

    async login(
        loginDto: LoginDto,
    ) {
        const user = await this.validateUser(
            loginDto.email,
            loginDto.password,
        );

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken =
            await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: UserMapper.toResponse(user),
        };
    }
}
import {
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { RefreshToken } from './entities/refresh-token.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserMapper } from '../users/mappers/user.mapper';
import { ConfigService } from '@nestjs/config';
import { JwtAccessPayload } from './interfaces/jwt-access-payload.interface';
import { JwtRefreshPayload } from './interfaces/jwt-refresh-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) { }

    private async generateAccessToken(
        payload: JwtAccessPayload,
    ): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>(
                'JWT_ACCESS_SECRET',
            ),
            expiresIn: this.configService.getOrThrow<StringValue>(
                'JWT_ACCESS_EXPIRES_IN',
            ),
        });
    }

    private async generateRefreshToken(
        payload: JwtRefreshPayload,
    ): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>(
                'JWT_REFRESH_SECRET',
            ),
            expiresIn: this.configService.getOrThrow<StringValue>(
                'JWT_REFRESH_EXPIRES_IN',
            ),
        });
    }

    private async createRefreshTokenSession(
        userId: string,
    ): Promise<RefreshToken> {
        const refreshTokenEntity =
            this.refreshTokenRepository.create({
                tokenHash: crypto.randomBytes(32).toString('hex'),
                expiresAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                ),
                user: {
                    id: userId,
                },
            });

        return this.refreshTokenRepository.save(
            refreshTokenEntity,
        );
    }

    private async updateRefreshTokenHash(
        refreshTokenId: string,
        refreshToken: string,
    ): Promise<void> {
        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        await this.refreshTokenRepository.update(
            refreshTokenId,
            {
                tokenHash,
                revokedAt: null,
                expiresAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                ),
            },
        );
    }



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
    async login(loginDto: LoginDto) {
        const user = await this.validateUser(
            loginDto.email,
            loginDto.password,
        );

        const accessPayload: JwtAccessPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: 'access',
        };

        const accessToken =
            await this.generateAccessToken(accessPayload);


        const refreshTokenSession =
            await this.createRefreshTokenSession(
                user.id,
            );


        const refreshPayload: JwtRefreshPayload = {
            sub: user.id,
            sessionId: refreshTokenSession.id,
            type: 'refresh',
        };


        const refreshToken =
            await this.generateRefreshToken(
                refreshPayload,
            );


        await this.updateRefreshTokenHash(
            refreshTokenSession.id,
            refreshToken,
        );


        return {
            accessToken,
            refreshToken,
            user: UserMapper.toResponse(user),
        };
    }

    async refresh(
        refreshTokenDto: RefreshTokenDto,
    ) {
        const refreshToken =
            refreshTokenDto.refreshToken;

        let payload: JwtRefreshPayload;

        try {
            payload =
                await this.jwtService.verifyAsync<JwtRefreshPayload>(
                    refreshToken,
                    {
                        secret:
                            this.configService.getOrThrow<string>(
                                'JWT_REFRESH_SECRET',
                            ),
                    },
                );
        } catch {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }


        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');


        const storedToken =
            await this.refreshTokenRepository.findOne({
                where: {
                    id: payload.sessionId,
                    tokenHash,
                },
                relations: {
                    user: true,
                },
            });


        if (!storedToken) {
            throw new UnauthorizedException(
                'Refresh token not found',
            );
        }


        if (storedToken.revokedAt) {
            throw new UnauthorizedException(
                'Refresh token revoked',
            );
        }


        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException(
                'Refresh token expired',
            );
        }


        const user = storedToken.user;


        const accessPayload: JwtAccessPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            type: 'access',
        };


        const accessToken =
            await this.generateAccessToken(
                accessPayload,
            );


        const newRefreshPayload: JwtRefreshPayload = {
            sub: user.id,
            sessionId: storedToken.id,
            type: 'refresh',
        };


        const newRefreshToken =
            await this.generateRefreshToken(
                newRefreshPayload,
            );


        await this.updateRefreshTokenHash(
            storedToken.id,
            newRefreshToken,
        );


        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

   async logout(
    logoutDto: LogoutDto,
): Promise<void> {

    const refreshToken =
        logoutDto.refreshToken;

    let payload: JwtRefreshPayload;

    try {
        payload =
            await this.jwtService.verifyAsync<JwtRefreshPayload>(
                refreshToken,
                {
                    secret:
                        this.configService.getOrThrow<string>(
                            'JWT_REFRESH_SECRET',
                        ),
                },
            );
    } catch {
        throw new UnauthorizedException(
            'Invalid refresh token',
        );
    }


    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');


    const storedToken =
        await this.refreshTokenRepository.findOne({
            where: {
                id: payload.sessionId,
                tokenHash,
            },
        });


    if (!storedToken) {
        throw new UnauthorizedException(
            'Refresh token not found',
        );
    }


    if (storedToken.revokedAt) {
        throw new UnauthorizedException(
            'Refresh token already revoked',
        );
    }


    await this.refreshTokenRepository.update(
        {
            id: payload.sessionId,
            tokenHash,
        },
        {
            revokedAt: new Date(),
        },
    );
}
}
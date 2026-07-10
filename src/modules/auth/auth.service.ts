import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

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
}
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserResponseDto } from './dto/user-response.dto';

import { UserMapper } from './mappers/user.mapper';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /* Read */
  async findAll(): Promise<UserResponseDto[]> {
    const users =
      await this.userRepository.find();

    return users.map(
      (user) => UserMapper.toResponse(user),
    );
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {

    return this.userRepository.findOne({
      where: {
        email,
      },
    });

  }

  async findEntityById(
  id: string,
): Promise<User> {

  const user =
    await this.userRepository.findOne({
      where: {
        id,
      },
    });


  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }


  return user;
}

  async findById(
    id: string,
  ): Promise<UserResponseDto> {

    const user =
      await this.userRepository.findOne({
        where: {
          id,
        },
      });


    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }


    return UserMapper.toResponse(
      user,
    );
  }

  /* Create */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {

    const existingUser =
      await this.findByEmail(
        createUserDto.email,
      );

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const user =
      this.userRepository.create(
        createUserDto,
      );

    const savedUser =
      await this.userRepository.save(
        user,
      );

    return UserMapper.toResponse(
      savedUser,
    );
  }
  /* Updates */
  async update(
  id: string,
  updateUserDto: UpdateUserDto,
): Promise<UserResponseDto> {

  const user =
    await this.findEntityById(id);


  Object.assign(
    user,
    updateUserDto,
  );


  const updatedUser =
    await this.userRepository.save(user);


  return UserMapper.toResponse(
    updatedUser,
  );
}
}



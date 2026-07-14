import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,

} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './enums/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  /* GET */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get()
findAll() {
  return this.usersService.findAll();
}

  @Get(':id')
  findById(
    @Param('id') id: string,
  ) {
    return this.usersService.findById(id);
  }

  /* POST */
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  // PATCH
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
    );
  }

}
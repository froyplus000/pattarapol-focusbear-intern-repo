import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users - Demonstrates ValidationPipe with DTO
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'User created successfully',
      data: this.usersService.create(createUserDto),
    };
  }

  // GET /users - Get all users (no pipes needed)
  @Get()
  findAll() {
    return {
      message: 'Users retrieved successfully',
      data: this.usersService.findAll(),
    };
  }

  // GET /users/:id - Demonstrates ParseIntPipe for path parameters
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'User retrieved successfully',
      data: this.usersService.findOne(id),
    };
  }

  // PATCH /users/:id - Combines ParseIntPipe and ValidationPipe
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      message: 'User updated successfully',
      data: this.usersService.update(id, updateUserDto),
    };
  }

  // DELETE /users/:id - Demonstrates ParseIntPipe
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.usersService.remove(id);
    return {
      message: 'User deleted successfully',
      deletedId: id,
    };
  }
}

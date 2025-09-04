import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoggerErrorInterceptor } from '../interceptors/logger-error.interceptor';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, LoggerErrorInterceptor) // 🔒 Hide passwords + 🚨 Log errors
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🧪 TEST ENDPOINT: Simple test without database
  @Get('test')
  testExclude(): User {
    console.log('🧪 Testing @Exclude decorator...');

    // Create a User instance manually
    const user = new User();
    user.id = 1;
    user.username = 'testuser';
    user.firstName = 'Test';
    user.lastName = 'User';
    user.password = 'this-should-be-hidden';

    console.log('📋 Raw user object (before interceptor):', user);
    return user; // ClassSerializerInterceptor should hide password
  }

  // 🚨 TEST ENDPOINT: Test error logging
  @Get('test-error')
  testError(): never {
    console.log('🚨 Testing LoggerErrorInterceptor...');
    throw new HttpException('This is a test error!', HttpStatus.BAD_REQUEST);
  }

  // 💥 TEST ENDPOINT: Test unexpected error
  @Get('test-crash')
  testCrash(): never {
    console.log('💥 Testing unexpected error...');
    throw new Error('Something went wrong unexpectedly!');
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('📝 Creating user with data:', {
      ...createUserDto,
      password: '[HIDDEN]',
    });
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    console.log(
      '📋 Getting all users (passwords will be hidden by interceptor)',
    );
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(
      `👤 Getting user ${id} (password will be hidden by interceptor)`,
    );
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(`✏️ Updating user ${id}`);
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(`🗑️ Deleting user ${id}`);
    return this.usersService.remove(+id);
  }
}

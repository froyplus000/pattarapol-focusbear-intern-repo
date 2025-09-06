import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UsersService, CreateUserDto } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        success: true,
        message: "User created successfully",
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to create user: " + error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        success: true,
        message: "Users retrieved successfully (decrypted data)",
        count: users.length,
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve users: " + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("raw")
  async getRawDatabaseValues() {
    try {
      const rawData = await this.usersService.getRawDatabaseValues();
      return {
        success: true,
        message: "Raw database values (encrypted data as stored)",
        count: rawData.length,
        data: rawData,
        note: "Notice how email, ssn, and sensitiveNotes are encrypted in the database",
      };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve raw data: " + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "User retrieved successfully (decrypted data)",
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve user: " + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.usersService.remove(+id);
      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      throw new HttpException(
        "Failed to delete user: " + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

export interface CreateUserDto {
  name: string;
  email: string;
  ssn?: string;
  phoneNumber?: string;
  sensitiveNotes?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Special method to show raw database values (encrypted)
  async getRawDatabaseValues(): Promise<any[]> {
    // This will return the actual encrypted values as stored in the database
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    const rawResults = await queryRunner.query(
      'SELECT * FROM users ORDER BY "createdAt" DESC'
    );
    await queryRunner.release();
    return rawResults;
  }
}

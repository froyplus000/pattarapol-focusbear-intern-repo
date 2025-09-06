import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export interface CreateUserDto {
    name: string;
    email: string;
    ssn?: string;
    phoneNumber?: string;
    sensitiveNotes?: string;
}
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    remove(id: number): Promise<void>;
    getRawDatabaseValues(): Promise<any[]>;
}

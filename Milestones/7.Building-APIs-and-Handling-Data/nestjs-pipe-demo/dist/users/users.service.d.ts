import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    age?: number;
    createdAt: Date;
}
export declare class UsersService {
    private users;
    private currentId;
    create(createUserDto: CreateUserDto): User;
    findAll(): User[];
    findOne(id: number): User;
    update(id: number, updateUserDto: UpdateUserDto): User;
    remove(id: number): void;
}

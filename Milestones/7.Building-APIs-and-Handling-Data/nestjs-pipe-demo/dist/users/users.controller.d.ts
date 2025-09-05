import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): {
        message: string;
        data: import("./users.service").User;
    };
    findAll(): {
        message: string;
        data: import("./users.service").User[];
    };
    findOne(id: number): {
        message: string;
        data: import("./users.service").User;
    };
    update(id: number, updateUserDto: UpdateUserDto): {
        message: string;
        data: import("./users.service").User;
    };
    remove(id: number): {
        message: string;
        deletedId: number;
    };
}

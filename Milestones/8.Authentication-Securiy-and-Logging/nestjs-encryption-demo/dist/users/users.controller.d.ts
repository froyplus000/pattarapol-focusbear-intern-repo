import { UsersService, CreateUserDto } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user.entity").User;
    }>;
    findAll(): Promise<{
        success: boolean;
        message: string;
        count: number;
        data: import("../entities/user.entity").User[];
    }>;
    getRawDatabaseValues(): Promise<{
        success: boolean;
        message: string;
        count: number;
        data: any[];
        note: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user.entity").User;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

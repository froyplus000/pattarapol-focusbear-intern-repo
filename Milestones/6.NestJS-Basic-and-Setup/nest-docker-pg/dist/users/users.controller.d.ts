import { UsersService } from './users.service';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    create(body: {
        name: string;
    }): Promise<import("./user.entity").User>;
}

import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class DatabaseSeederService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    seedUsers(): Promise<void>;
    seedAll(): Promise<void>;
    clearUsers(): Promise<void>;
}

import { User } from './user.entity';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';

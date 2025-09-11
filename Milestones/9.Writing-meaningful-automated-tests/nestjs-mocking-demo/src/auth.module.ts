import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordHasher } from './password-hasher.service';
import { ProfileClient } from './profile-client.service';
import { USER_REPOSITORY } from './user.repository';

// Mock implementation for demo (in real app, this would be TypeORM repository)
const mockUserRepository = {
  async findByUsername(username: string) {
    // Mock data for demo
    await new Promise((resolve) => setTimeout(resolve, 1));
    if (username === 'john') {
      return {
        id: 1,
        username: 'john',
        passwordHash: 'hashed_password123',
      };
    }
    return null;
  },
};

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHasher,
    ProfileClient,
    {
      provide: USER_REPOSITORY,
      useValue: mockUserRepository,
    },
  ],
})
export class AuthModule {}

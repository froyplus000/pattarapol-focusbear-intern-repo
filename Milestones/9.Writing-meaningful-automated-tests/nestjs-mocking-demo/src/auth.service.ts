import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { UserRepository } from './user.repository';
import { USER_REPOSITORY } from './user.repository';
import { PasswordHasher } from './password-hasher.service';
import { ProfileClient } from './profile-client.service';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResult {
  userId: number;
  username: string;
  profile?: unknown;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly profileClient: ProfileClient,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResult> {
    const { username, password } = loginDto;

    // Find user
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isValidPassword = this.passwordHasher.validatePassword(
      password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fetch profile (optional external call)
    const profile = await this.profileClient.fetchUserProfile(user.id);

    return {
      userId: user.id,
      username: user.username,
      profile,
    };
  }
}

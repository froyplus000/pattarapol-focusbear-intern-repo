import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User, AuthResponse } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  // Mock database - in real app this would be a database
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // In real app, this would be hashed
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password456',
    },
  ];

  login(loginDto: LoginDto): AuthResponse {
    const { email, password } = loginDto;

    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Mock JWT token - in real app, use JwtService
    const token = `mock.jwt.token.${user.id}`;

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  // Helper method to validate JWT token (mock implementation)
  validateToken(token: string): { userId: number } | null {
    // Mock token validation - in real app, use JwtService
    const match = token.match(/mock\.jwt\.token\.(\d+)/);
    if (match) {
      return { userId: parseInt(match[1]) };
    }
    return null;
  }
}

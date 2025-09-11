import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHasher {
  validatePassword(plainPassword: string, hashedPassword: string): boolean {
    // In a real app, this would use bcrypt or similar
    // For demo purposes, we'll just do a simple comparison
    return plainPassword === hashedPassword.replace('hashed_', '');
  }

  hashPassword(password: string): string {
    // Simple mock hashing for demo
    return `hashed_${password}`;
  }
}

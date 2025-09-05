import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DatabaseSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedUsers(): Promise<void> {
    // Check if users already exist to avoid duplicate seeding
    const existingUsers = await this.userRepository.count();

    if (existingUsers > 0) {
      console.log('👥 Users already exist, skipping user seeding...');
      return;
    }

    console.log('🌱 Seeding users...');

    // Sample users data
    const usersData = [
      {
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        age: 28,
        password: 'password123',
      },
      {
        username: 'jane_smith',
        firstName: 'Jane',
        lastName: 'Smith',
        age: 32,
        password: 'password456',
      },
      {
        username: 'admin_user',
        firstName: 'Admin',
        lastName: 'User',
        age: 30,
        password: 'admin123',
      },
      {
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        password: 'test123',
      },
    ];

    // Create and save users
    for (const userData of usersData) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      console.log(`✅ Created user: ${userData.username}`);
    }

    console.log('🎉 User seeding completed!');
  }

  async seedAll(): Promise<void> {
    console.log('🚀 Starting database seeding...');

    try {
      await this.seedUsers();
      // Add more seed methods here as needed
      // await this.seedOtherEntities();

      console.log('✨ All seeding completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  async clearUsers(): Promise<void> {
    console.log('🧹 Clearing users...');
    await this.userRepository.clear();
    console.log('✅ Users cleared');
  }
}

/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordHasher } from './password-hasher.service';
import { ProfileClient } from './profile-client.service';
import { USER_REPOSITORY } from './user.repository';
import type { UserRepository } from './user.repository';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;
  let mockProfileClient: jest.Mocked<ProfileClient>;

  beforeEach(async () => {
    // Create mock implementations using jest.fn()
    mockUserRepository = {
      findByUsername: jest.fn(),
    };

    mockPasswordHasher = {
      validatePassword: jest.fn(),
      hashPassword: jest.fn(),
    };

    mockProfileClient = {
      fetchUserProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: PasswordHasher,
          useValue: mockPasswordHasher,
        },
        {
          provide: ProfileClient,
          useValue: mockProfileClient,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockUser = new User(1, 'john', 'hashed_password123');
    const loginDto = { username: 'john', password: 'password123' };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      const mockProfile = { userId: 1, profileData: 'test data' };
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      mockPasswordHasher.validatePassword.mockReturnValue(true);
      mockProfileClient.fetchUserProfile.mockResolvedValue(mockProfile);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        userId: 1,
        username: 'john',
        profile: mockProfile,
      });
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('john');
      expect(mockPasswordHasher.validatePassword).toHaveBeenCalledWith(
        'password123',
        'hashed_password123',
      );
      expect(mockProfileClient.fetchUserProfile).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockUserRepository.findByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('john');
      expect(mockPasswordHasher.validatePassword).not.toHaveBeenCalled();
      expect(mockProfileClient.fetchUserProfile).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with wrong password', async () => {
      // Arrange
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      mockPasswordHasher.validatePassword.mockReturnValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('john');
      expect(mockPasswordHasher.validatePassword).toHaveBeenCalledWith(
        'password123',
        'hashed_password123',
      );
      expect(mockProfileClient.fetchUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('using jest.spyOn() example', () => {
    it('should demonstrate jest.spyOn() usage', async () => {
      // Arrange - using jest.spyOn() to spy on an existing method
      const mockUser = new User(1, 'john', 'hashed_password123');
      const loginDto = { username: 'john', password: 'password123' };

      mockUserRepository.findByUsername.mockResolvedValue(mockUser);

      // Using jest.spyOn() to spy on the validatePassword method
      const validatePasswordSpy = jest
        .spyOn(mockPasswordHasher, 'validatePassword')
        .mockReturnValue(true);

      mockProfileClient.fetchUserProfile.mockResolvedValue({
        userId: 1,
        data: 'profile',
      });

      // Act
      await service.login(loginDto);

      // Assert - verify the spy was called
      expect(validatePasswordSpy).toHaveBeenCalledWith(
        'password123',
        'hashed_password123',
      );
      expect(validatePasswordSpy).toHaveBeenCalledTimes(1);

      // Restore the spy
      validatePasswordSpy.mockRestore();
    });
  });
});

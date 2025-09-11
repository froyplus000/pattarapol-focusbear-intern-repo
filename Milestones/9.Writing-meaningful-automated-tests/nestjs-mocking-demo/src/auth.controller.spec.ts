import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { LoginDto, LoginResult } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: { login: jest.Mock };

  beforeEach(async () => {
    // Create mock AuthService using jest.fn()
    mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    const loginDto: LoginDto = {
      username: 'john',
      password: 'password123',
    };

    it('should return login result on successful authentication', async () => {
      // Arrange
      const expectedResult: LoginResult = {
        userId: 1,
        username: 'john',
        profile: { userId: 1, data: 'profile data' },
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should propagate UnauthorizedException from service', async () => {
      // Arrange
      const error = new UnauthorizedException('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should pass through login data correctly', async () => {
      // Arrange
      const customLoginDto: LoginDto = {
        username: 'jane',
        password: 'secret456',
      };
      const expectedResult: LoginResult = {
        userId: 2,
        username: 'jane',
        profile: { userId: 2, data: 'jane profile' },
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.login(customLoginDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(customLoginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'jane',
        password: 'secret456',
      });
    });
  });
});

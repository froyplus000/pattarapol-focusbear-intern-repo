import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import request from 'supertest';

describe('AppController - Unit Test', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('Test - Dependency Injection', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should have AppService injected', () => {
      expect(appService).toBeDefined();
    });

    it('should call AppService methods through controller', () => {
      const getHelloSpy = jest.spyOn(appService, 'getHello');
      appController.getHello();
      expect(getHelloSpy).toHaveBeenCalled();
    });

    it('should properly initialize with AppService dependency', () => {
      // Test that the controller can access the injected service
      expect(appController['appService']).toBe(appService);
    });
  });

  describe('Test - Hello and Hi', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
    it('should return "Hi World!"', () => {
      expect(appController.getHi()).toBe('Hi World!');
    });
  });

  describe('Test - Log In', () => {
    it('should return "Login successful!" for valid credentials', () => {
      expect(appController.login('admin', '1234')).toBe('Login successful!');
    });

    it('should return "Invalid credentials" for wrong username', () => {
      expect(appController.login('wronguser', '1234')).toBe(
        'Invalid credentials',
      );
    });

    it('should return "Invalid credentials" for wrong password', () => {
      expect(appController.login('admin', 'wrongpass')).toBe(
        'Invalid credentials',
      );
    });

    it('should return "Invalid credentials" for both wrong username and password', () => {
      expect(appController.login('wronguser', 'wrongpass')).toBe(
        'Invalid credentials',
      );
    });

    it('should return "Invalid credentials" for empty username', () => {
      expect(appController.login('', '1234')).toBe('Invalid credentials');
    });

    it('should return "Invalid credentials" for empty password', () => {
      expect(appController.login('admin', '')).toBe('Invalid credentials');
    });

    it('should return "Invalid credentials" for both empty credentials', () => {
      expect(appController.login('', '')).toBe('Invalid credentials');
    });

    it('should handle null username gracefully', () => {
      expect(appController.login(null as unknown as string, '1234')).toBe(
        'Invalid credentials',
      );
    });

    it('should handle null password gracefully', () => {
      expect(appController.login('admin', null as unknown as string)).toBe(
        'Invalid credentials',
      );
    });

    it('should handle undefined username gracefully', () => {
      expect(appController.login(undefined as unknown as string, '1234')).toBe(
        'Invalid credentials',
      );
    });

    it('should handle undefined password gracefully', () => {
      expect(appController.login('admin', undefined as unknown as string)).toBe(
        'Invalid credentials',
      );
    });
  });
});

describe('AppController - Unit Test with Mocked Service', () => {
  let controller: AppController;
  let mockAppService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const mockService = {
      getHello: jest.fn().mockReturnValue('Mocked Hello!'),
      getHi: jest.fn().mockReturnValue('Mocked Hi!'),
      login: jest.fn().mockReturnValue('Mocked Login!'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    mockAppService = module.get(AppService);
  });

  it('should work with mocked AppService', () => {
    expect(controller.getHello()).toBe('Mocked Hello!');
    expect(mockAppService.getHello).toHaveBeenCalled();
  });

  it('should handle constructor dependency injection with mock', () => {
    expect(controller).toBeDefined();
    expect(controller['appService']).toBe(mockAppService);
  });
});

describe('AppController - Examples of WEAK vs STRONG Assertions', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('❌ WEAK Assertions - Examples of what NOT to do', () => {
    it('WEAK: login method returns something', () => {
      const result = appController.login('admin', '1234');
      // ❌ WEAK: Only checks if result exists, not what it contains
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('WEAK: login method handles invalid input somehow', () => {
      const result = appController.login('wrong', 'wrong');
      // ❌ WEAK: Just checks that something is returned
      expect(result).not.toBeNull();
      expect(result.length).toBeGreaterThan(0);
    });

    it('WEAK: getHello calls the service', () => {
      const spy = jest.spyOn(appService, 'getHello');
      appController.getHello();
      // ❌ WEAK: Only verifies method was called, not the actual behavior
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('✅ STRONG Assertions - Examples of meaningful tests', () => {
    it('STRONG: login returns exact success message for valid credentials', () => {
      const result = appController.login('admin', '1234');
      // ✅ STRONG: Tests exact expected behavior and output
      expect(result).toBe('Login successful!');
      expect(result).toMatch(/^Login successful!$/);
      expect(result).not.toContain('Invalid');
    });

    it('STRONG: login returns specific error message for invalid credentials', () => {
      const result = appController.login('hacker', 'badpass');
      // ✅ STRONG: Tests exact error message and business logic
      expect(result).toBe('Invalid credentials');
      expect(result).toMatch(/^Invalid credentials$/);
      expect(result).not.toContain('successful');
    });

    it('STRONG: getHello returns exact expected greeting', () => {
      const spy = jest.spyOn(appService, 'getHello');
      const result = appController.getHello();

      // ✅ STRONG: Tests both behavior AND return value
      expect(result).toBe('Hello World!');
      expect(result.startsWith('Hello')).toBe(true);
      expect(result.endsWith('World!')).toBe(true);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(); // No parameters
    });

    it('STRONG: login properly validates both username AND password', () => {
      // ✅ STRONG: Tests specific business rules
      expect(appController.login('admin', 'wrong')).toBe('Invalid credentials');
      expect(appController.login('wrong', '1234')).toBe('Invalid credentials');
      expect(appController.login('admin', '1234')).toBe('Login successful!');

      // Test that BOTH conditions must be met
      expect(appController.login('admin', '1234')).not.toBe(
        'Invalid credentials',
      );
    });
  });

  describe('🔬 EDGE CASE Testing - Testing boundary conditions', () => {
    it('should handle case sensitivity properly', () => {
      // Test exact case matching requirements
      expect(appController.login('ADMIN', '1234')).toBe('Invalid credentials');
      expect(appController.login('admin', '1234')).toBe('Login successful!');
      expect(appController.login('Admin', '1234')).toBe('Invalid credentials');
    });

    it('should handle whitespace in credentials', () => {
      // Test whitespace handling
      expect(appController.login(' admin', '1234')).toBe('Invalid credentials');
      expect(appController.login('admin ', '1234')).toBe('Invalid credentials');
      expect(appController.login('admin', ' 1234')).toBe('Invalid credentials');
      expect(appController.login('admin', '1234 ')).toBe('Invalid credentials');
    });

    it('should handle special characters in passwords', () => {
      // Test that only exact password works
      expect(appController.login('admin', '1234!')).toBe('Invalid credentials');
      expect(appController.login('admin', '@1234')).toBe('Invalid credentials');
      expect(appController.login('admin', '12345')).toBe('Invalid credentials');
      expect(appController.login('admin', '123')).toBe('Invalid credentials');
    });
  });

  describe('🚨 DANGEROUS Tests - Tests that give false confidence', () => {
    it('DANGEROUS: This test would pass even if login always returned empty string', () => {
      const result = appController.login('admin', '1234');
      // 🚨 DANGEROUS: This would pass even if login was broken and returned ""
      expect(typeof result).toBe('string');
      expect(result).not.toBeUndefined();
    });

    it('BETTER: This test would catch if login returned empty string', () => {
      const result = appController.login('admin', '1234');
      // ✅ BETTER: This would fail if login was broken
      expect(result).toBe('Login successful!');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('successful');
    });

    it('DANGEROUS: Test that passes regardless of actual implementation', () => {
      const result1 = appController.login('admin', '1234');
      const result2 = appController.login('wrong', 'wrong');

      // 🚨 DANGEROUS: These assertions are too generic
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(typeof result1).toBe(typeof result2);
    });

    it('BETTER: Test that verifies specific business logic', () => {
      const validResult = appController.login('admin', '1234');
      const invalidResult = appController.login('wrong', 'wrong');

      // ✅ BETTER: These assertions test actual business requirements
      expect(validResult).toBe('Login successful!');
      expect(invalidResult).toBe('Invalid credentials');
      expect(validResult).not.toBe(invalidResult);
      expect(validResult.includes('successful')).toBe(true);
      expect(invalidResult.includes('Invalid')).toBe(true);
    });
  });
});

describe('AppController (e2e) - User say hello and log in', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('User say Hello to server', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('User say Hi to server', () => {
    return request(app.getHttpServer())
      .get('/hi')
      .expect(200)
      .expect('Hi World!');
  });
  it('User login with valid credentials', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({ username: 'admin', password: '1234' })
      .expect(201)
      .expect('Login successful!');
  });

  it('User login with invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({ username: 'user', password: 'wrong' })
      .expect(201)
      .expect('Invalid credentials');
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('Advanced Testing Strategies', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('🧬 Property-Based Testing Concepts', () => {
    it('should never return empty string for any login input', () => {
      const testInputs = [
        ['admin', '1234'], // Valid case
        ['wrong', 'wrong'], // Invalid case
        ['', ''], // Empty case
        ['admin', ''], // Partial empty
        ['', '1234'], // Partial empty
        ['Admin', '1234'], // Case variation
        ['admin', '1234 '], // Whitespace
        [' admin', '1234'], // Leading space
      ];

      testInputs.forEach(([username, password]) => {
        const result = appController.login(username, password);
        // Property: Result should never be empty
        expect(result.length).toBeGreaterThan(0);
        expect(result.trim().length).toBeGreaterThan(0);
      });
    });

    it('should always return one of exactly two possible messages', () => {
      const validMessages = ['Login successful!', 'Invalid credentials'];

      const testCases = [
        ['admin', '1234'],
        ['user', 'pass'],
        ['', 'test'],
        ['test', ''],
        ['ADMIN', '1234'],
        ['admin', '1235'],
        [null as any, '1234'],
        ['admin', null as any],
      ];

      testCases.forEach(([username, password]) => {
        const result = appController.login(username, password);
        // Property: Output must be one of exactly two known values
        expect(validMessages).toContain(result);
        expect(validMessages.length).toBe(2); // Exactly two options
      });
    });
  });

  describe('📋 Contract Testing', () => {
    it('should satisfy the authentication contract', () => {
      // Contract: ONLY admin/1234 should succeed
      expect(appController.login('admin', '1234')).toBe('Login successful!');

      // Contract: ALL other combinations should fail with specific message
      const failureCases = [
        ['admin', 'wrong'], // Wrong password
        ['wrong', '1234'], // Wrong username
        ['Admin', '1234'], // Wrong case
        ['admin', ''], // Empty password
        ['', '1234'], // Empty username
        ['admin', '1234 '], // Trailing space
        [' admin', '1234'], // Leading space
        ['admin', '12345'], // Almost right password
        ['administrator', '1234'], // Similar username
      ];

      failureCases.forEach(([username, password]) => {
        const result = appController.login(username, password);
        expect(result).toBe('Invalid credentials');
        expect(result).not.toContain('successful');
      });
    });

    it('should maintain consistent greeting contract', () => {
      // Contract: getHello should always return exactly "Hello World!"
      expect(appController.getHello()).toBe('Hello World!');
      expect(appController.getHello()).toMatch(/^Hello World!$/);

      // Contract: getHi should always return exactly "Hi World!"
      expect(appController.getHi()).toBe('Hi World!');
      expect(appController.getHi()).toMatch(/^Hi World!$/);

      // Contract: Different methods should return different greetings
      expect(appController.getHello()).not.toBe(appController.getHi());
    });
  });

  describe('🔍 Mutation Testing Concepts', () => {
    it('should catch operator mutations (AND vs OR)', () => {
      // This test would catch if someone changed && to ||
      expect(appController.login('admin', 'wrong')).toBe('Invalid credentials');
      expect(appController.login('wrong', '1234')).toBe('Invalid credentials');
      expect(appController.login('admin', '1234')).toBe('Login successful!');

      // If condition was mutated to OR, first two would incorrectly succeed
    });

    it('should catch constant mutations', () => {
      // This test would catch if someone changed the password constant
      expect(appController.login('admin', '1233')).toBe('Invalid credentials'); // One less
      expect(appController.login('admin', '1235')).toBe('Invalid credentials'); // One more
      expect(appController.login('admin', '1234')).toBe('Login successful!'); // Exact match

      // Would catch if hardcoded password was accidentally changed
    });

    it('should catch negation mutations', () => {
      // This test would catch if someone added ! to negate the condition
      expect(appController.login('admin', '1234')).toBe('Login successful!');
      expect(appController.login('wrong', 'wrong')).toBe('Invalid credentials');

      // If condition was negated, results would be flipped
    });
  });

  describe('📊 Performance and Side Effects', () => {
    it('should not have performance regressions', () => {
      const start = performance.now();

      // Run multiple operations
      for (let i = 0; i < 1000; i++) {
        appController.login('admin', '1234');
        appController.getHello();
        appController.getHi();
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete 3000 operations in reasonable time
      expect(duration).toBeLessThan(100); // Less than 100ms
    });

    it('should not modify global state', () => {
      const initialState = JSON.stringify(appService);

      // Perform operations
      appController.login('admin', '1234');
      appController.login('wrong', 'wrong');
      appController.getHello();
      appController.getHi();

      const finalState = JSON.stringify(appService);

      // Service should remain unchanged
      expect(finalState).toBe(initialState);
    });

    it('should be stateless and deterministic', () => {
      // Same input should always produce same output
      const results1 = [
        appController.login('admin', '1234'),
        appController.login('wrong', 'wrong'),
        appController.getHello(),
        appController.getHi(),
      ];

      const results2 = [
        appController.login('admin', '1234'),
        appController.login('wrong', 'wrong'),
        appController.getHello(),
        appController.getHi(),
      ];

      expect(results1).toEqual(results2);
    });
  });
});

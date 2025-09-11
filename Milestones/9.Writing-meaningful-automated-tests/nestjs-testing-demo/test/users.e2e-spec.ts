import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { UsersModule } from '../src/users/users.module';

describe('Users API (e2e) - Simple Demo', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable validation globally (important for testing DTO validation)
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ✅ Simple GET endpoint test
  describe('GET /users/health', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/users/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.message).toBe('Users service is running');
        });
    });
  });

  // ✅ POST endpoint with validation tests
  describe('POST /users/login', () => {
    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          // Test successful response structure
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id', 1);
          expect(res.body.user).toHaveProperty('name', 'John Doe');
          expect(res.body.user).toHaveProperty('email', 'john@example.com');
          expect(res.body.user).not.toHaveProperty('password'); // Security check

          // Test mock JWT format
          expect(res.body.access_token).toMatch(/^mock\.jwt\.token\.\d+$/);
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid email or password');
        });
    });

    // ✅ Request validation tests
    it('should validate missing email', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Email is required');
        });
    });

    it('should validate invalid email format', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'invalid-email-format',
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Please provide a valid email address',
          );
        });
    });

    it('should validate password length', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: '123', // Too short
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Password must be at least 6 characters long',
          );
        });
    });

    it('should handle completely empty request body', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({})
        .expect(400)
        .expect((res) => {
          // Should contain multiple validation errors
          expect(res.body.message).toEqual(
            expect.arrayContaining([
              'Email is required',
              'Please provide a valid email address',
              'Password is required',
              'Password must be at least 6 characters long',
            ]),
          );
        });
    });
  });

  // ✅ Authentication mocking demonstration
  describe('Authentication Mocking Demo', () => {
    it('should demonstrate how authentication works with mock tokens', async () => {
      // Step 1: Login to get mock JWT token
      const loginResponse = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'jane@example.com',
          password: 'password456',
        })
        .expect(201);

      // Step 2: Verify the mock token structure
      const { access_token, user } = loginResponse.body;
      expect(access_token).toBe('mock.jwt.token.2'); // Mock token for user ID 2
      expect(user.name).toBe('Jane Smith');

      // Step 3: Show how this token would be used in subsequent requests
      // (In a real app, you would make authenticated requests with this token)
      console.log('Mock JWT Token received:', access_token);
      console.log('User data:', user);
    });

    it('should test different user scenarios', async () => {
      // Test multiple users to show different token generation
      const users = [
        { email: 'john@example.com', password: 'password123', expectedId: 1 },
        { email: 'jane@example.com', password: 'password456', expectedId: 2 },
      ];

      for (const testUser of users) {
        const response = await request(app.getHttpServer())
          .post('/users/login')
          .send({
            email: testUser.email,
            password: testUser.password,
          })
          .expect(201);

        // Verify each user gets their own unique mock token
        expect(response.body.access_token).toBe(
          `mock.jwt.token.${testUser.expectedId}`,
        );
        expect(response.body.user.id).toBe(testUser.expectedId);
      }
    });
  });

  // ✅ Error handling and edge cases
  describe('Error Handling & Edge Cases', () => {
    it('should handle malformed JSON gracefully', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    it('should handle different HTTP methods on same endpoint', () => {
      // Test that GET on login endpoint is not allowed
      return request(app.getHttpServer()).get('/users/login').expect(404); // Method not allowed or not found
    });

    it('should handle non-existent endpoints', () => {
      return request(app.getHttpServer())
        .post('/users/nonexistent')
        .send({})
        .expect(404);
    });
  });
});

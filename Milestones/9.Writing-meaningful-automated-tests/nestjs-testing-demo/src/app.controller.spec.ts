import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import request from 'supertest';

describe('AppController - Unit Test', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
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
    it('should return "Login Successful!"', () => {
      expect(appController.login('admin', '1234')).toBe('Login successful!');
    });
    it('should return "Invalid credentials"', () => {
      expect(appController.login('anyone', 'invalidPW')).toBe(
        'Invalid credentials',
      );
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

  it('User say hello to server', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
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

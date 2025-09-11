# NestJS Mocking Demo

A minimal NestJS project demonstrating how to mock dependencies and database interactions in unit tests.

## 🎯 What This Demo Shows

This project demonstrates essential mocking patterns for NestJS testing:

1. **Mocking a service in a controller test** - How to mock `AuthService` in `AuthController` tests
2. **Mocking a database repository** - How to mock `UserRepository` in service tests
3. **Using `jest.fn()` vs `jest.spyOn()`** - Different approaches to creating mocks
4. **Mocking external services** - How to mock `ProfileClient` API calls

## 📁 Project Structure

```
src/
├── auth.controller.ts          # Simple login endpoint
├── auth.controller.spec.ts     # Controller tests (mocks AuthService)
├── auth.service.ts             # Business logic for authentication
├── auth.service.spec.ts        # Service tests (mocks dependencies)
├── auth.module.ts              # Module configuration
├── user.entity.ts              # Simple User entity
├── user.repository.ts          # Repository interface for mocking
├── password-hasher.service.ts  # Password validation service
└── profile-client.service.ts   # External API client service
```

## 🚀 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm test
```

3. Run tests with coverage:

```bash
npm run test:cov
```

4. Run tests in watch mode:

```bash
npm run test:watch
```

5. Start the application:

```bash
npm run start:dev
```

6. Test the endpoint:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "password123"}'
```

## 🧪 Key Testing Patterns

### 1. Mocking Providers with `useValue`

In `auth.service.spec.ts`:

```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useValue: mockUserRepository, // Mock the repository
    },
    {
      provide: PasswordHasher,
      useValue: mockPasswordHasher, // Mock the service
    },
  ],
}).compile();
```

### 2. Using `jest.fn()` for Simple Mocks

```typescript
const mockUserRepository = {
  findByUsername: jest.fn(),
};

// In test
mockUserRepository.findByUsername.mockResolvedValue(mockUser);
expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('john');
```

### 3. Using `jest.spyOn()` for Method Spying

```typescript
const validatePasswordSpy = jest
  .spyOn(mockPasswordHasher, 'validatePassword')
  .mockReturnValue(true);

expect(validatePasswordSpy).toHaveBeenCalledWith(
  'password123',
  'hashed_password123',
);
validatePasswordSpy.mockRestore();
```

### 4. Controller Testing Pattern

In `auth.controller.spec.ts`:

```typescript
const mockAuthService = {
  login: jest.fn(),
};

// Mock successful login
mockAuthService.login.mockResolvedValue(expectedResult);

// Mock error
mockAuthService.login.mockRejectedValue(
  new UnauthorizedException('Invalid credentials'),
);
```

## 📊 Test Coverage

The project includes comprehensive tests covering:

- ✅ Happy path scenarios
- ✅ Error conditions (user not found, wrong password)
- ✅ Service method calls verification
- ✅ Data flow validation
- ✅ Exception propagation

Run `npm run test:cov` to see detailed coverage report.

## 🔍 Why Mocking Matters

### Benefits of Mocking:

1. **Speed**: Tests run fast without real database connections
2. **Reliability**: No external dependencies can cause test failures
3. **Isolation**: Each unit is tested independently
4. **Control**: You control exactly what the dependencies return
5. **Coverage**: Easy to test error scenarios

### What We Mock:

- **Database repositories**: No real DB needed in unit tests
- **External APIs**: Control responses without network calls
- **Services**: Test components in isolation
- **Complex dependencies**: Focus on the unit under test

## 📝 Key Learnings

1. **`jest.fn()` vs `jest.spyOn()`**:
   - Use `jest.fn()` for complete mocks
   - Use `jest.spyOn()` to spy on existing methods

2. **NestJS Testing Module**:
   - Use `useValue` to provide mock implementations
   - Mock at the provider level, not the class level

3. **Test Structure**:
   - Arrange: Set up mocks and data
   - Act: Call the method under test
   - Assert: Verify behavior and calls

4. **Mock Verification**:
   - Check that methods were called with correct parameters
   - Verify call counts
   - Assert that methods were NOT called when appropriate

This demo provides a solid foundation for understanding mocking patterns in NestJS applications!

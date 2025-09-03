# NestJS Introduction

- **What is NestJS?**  
  A progressive Node.js framework built with TypeScript, inspired by Angular, focused on modularity, scalability, and maintainability.

- **How does it differ from Express.js?**  
  NestJS is opinionated with built-in DI, decorators, and modular architecture; Express.js is minimal and unopinionated.

- **Modular architecture (Modules, Controllers, Services):**

  - **Modules** group related code.
  - **Controllers** handle incoming requests and responses.
  - **Services** hold business logic and can be injected into controllers.

- **Dependency injection:**  
  NestJS uses a built-in IoC container. Services annotated with `@Injectable()` are automatically injected where needed.

- **Decorators:**  
  Decorators are special annotations that add metadata to classes, methods, or parameters.  
  They tell NestJS how to treat a piece of code.

  - `@Controller()` → marks a class as a controller to handle incoming requests.
  - `@Injectable()` → marks a class as a provider (service) that can be injected into other parts of the app.
  - `@Get()` → maps an HTTP GET request to a controller method.

  **Examples:**

  ```ts
  // Controller: Handles incoming requests
  @Controller("users")
  export class UserController {
    constructor(private readonly userService: UserService) {}

    // GET /users
    @Get()
    findAll() {
      return this.userService.getUsers();
    }
  }

  // Service: Business logic
  @Injectable()
  export class UserService {
    private users = ["Alice", "Bob"];

    getUsers() {
      return this.users;
    }
  }
  ```

---

## Reflection

### Key differences between NestJS and Express.js

- NestJS is opinionated and uses a modular, Angular-inspired architecture, while Express.js is minimal and unopinionated.
- NestJS has built-in dependency injection, decorators, and TypeScript support, making it more suitable for large-scale applications.
- Express is lightweight and flexible but requires developers to enforce structure themselves.

### Why does NestJS use decorators extensively?

- Decorators provide metadata to classes and methods, allowing NestJS to understand how they should behave (e.g., which class is a controller, which method handles a GET request).
- They make code more declarative and reduce boilerplate.

### How does NestJS handle dependency injection?

- NestJS has a built-in IoC (Inversion of Control) container.
- Services are marked with `@Injectable()`, and when included in a module’s `providers`, NestJS automatically injects them into controllers or other services.
- This makes code loosely coupled, testable, and easier to maintain.

### What benefits does modular architecture provide in a large-scale app?

- Encourages separation of concerns (e.g., AuthModule, UserModule, PaymentModule).
- Improves maintainability since each module is self-contained.
- Increases scalability because teams can work on different modules independently.
- Makes testing and debugging easier as each module has a clear responsibility.

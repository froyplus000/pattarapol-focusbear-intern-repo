# NestJS Architecture Reflection (nestjs-architecture.md)

### What is the purpose of a module in NestJS?

- A **module** is a container that organizes a set of related components such as controllers and providers.
- Every NestJS application has a root module (`AppModule`), but larger projects often have multiple feature modules (e.g., `UserModule`, `AuthModule`, `PaymentModule`).
- This modular structure makes it easier to manage complexity by grouping functionality into well-defined boundaries.
- Example: `UserModule` may include `UserController` and `UserService`, while `AuthModule` manages authentication separately.

---

### How does a controller differ from a provider?

- A **controller** is responsible for handling HTTP requests, routing, and shaping the response that is sent back to the client. It acts like the "entry point" to your API.
- A **provider (service)**, on the other hand, contains reusable business logic or data-handling functions. Providers are not directly exposed to clients — they work behind the scenes.
- Controllers often delegate tasks to providers instead of handling logic themselves, ensuring a clean separation of concerns.
- Example:
  - Controller (`UserController`) → Receives `GET /users`.
  - Provider (`UserService`) → Fetches users from memory or database.
  - Response → Controller sends data back to the client.

---

### Why is dependency injection useful in NestJS?

- **Dependency Injection (DI)** lets classes declare the services they depend on, without creating them directly. NestJS provides these services automatically through its IoC (Inversion of Control) container.
- Benefits of DI:
  - **Loose coupling:** Classes don’t need to know how a dependency is constructed.
  - **Reusability:** A service can be shared across multiple controllers.
  - **Testability:** In tests, real services can be replaced with mock implementations.
  - **Maintainability:** When logic changes, only the service needs updating — not every controller that uses it.
- Example: `UserController` doesn’t use `new UserService()`. Instead, NestJS injects an instance automatically because `UserService` is registered as a provider.

---

### How does NestJS ensure modularity and separation of concerns?

- NestJS enforces a layered architecture:
  - **Modules** → Define feature boundaries (e.g., User, Auth, Payment).
  - **Controllers** → Handle input/output (HTTP requests/responses).
  - **Providers (Services)** → Handle business logic and data.
- Each module can be developed, tested, and maintained independently. This is particularly valuable in large-scale apps with multiple developers or teams.
- Separation of concerns means:
  - Routes and request handling are isolated in controllers.
  - Core logic is centralized in providers.
  - Organization is enforced through modules.
- This design improves **scalability** (easy to add new modules), **maintainability** (clear boundaries for changes), and **collaboration** (teams can work on different modules without conflicts).

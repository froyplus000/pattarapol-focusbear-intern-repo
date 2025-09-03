# NestJS Architecture Reflection (nestjs-architecture.md)

### What is the purpose of a module in NestJS?

- A module is a container that groups related controllers and providers together.
- It helps organize the application into feature-based sections (e.g., UserModule, AuthModule).
- The root `AppModule` bootstraps the entire application.

---

### How does a controller differ from a provider?

- **Controller**: Handles incoming requests, maps routes to methods, and returns responses.
- **Provider (Service)**: Contains business logic and is injected into controllers or other services.
- Controllers focus on **input/output**, while providers focus on **logic and data handling**.

---

### Why is dependency injection useful in NestJS?

- Allows classes to request dependencies instead of creating them manually.
- Makes code more modular, testable, and reusable.
- Supports loose coupling so services can be swapped or mocked in testing.

---

### How does NestJS ensure modularity and separation of concerns?

- Uses **modules** to separate features into self-contained units.
- **Controllers** handle routing, **services** handle logic, and **modules** group them together.
- Clear boundaries improve maintainability, scalability, and teamwork on large projects.

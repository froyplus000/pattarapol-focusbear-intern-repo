# NestJS Dependency Injection Reflection (DI)

### How does dependency injection improve maintainability?

- DI reduces tight coupling by letting classes depend on abstractions instead of concrete implementations.
- Changes in one service don’t require changes in every controller using it.
- Makes testing easier since real services can be swapped with mock providers.
- Overall, DI ensures a modular, flexible, and maintainable codebase.

---

### What is the purpose of the @Injectable() decorator?

- `@Injectable()` marks a class as a provider that can be managed by NestJS’s IoC container.
- It allows the class to be injected into controllers or other services.
- Without `@Injectable()`, NestJS would not know how to create or provide the class.

---

### What are the different types of provider scopes, and when would you use each?

- **SINGLETON (default):** One shared instance for the whole app. Best for common services like authentication, data access, or logging.
- **REQUEST:** Creates a new instance per request. Useful when services must maintain request-specific state.
- **TRANSIENT:** Creates a new instance each time it’s injected. Best for lightweight, stateless, or utility-style services.

---

### How does NestJS automatically resolve dependencies?

- When a class (e.g., controller) declares dependencies in its constructor, NestJS looks at the module’s `providers` array.
- It creates an instance of each provider using the IoC container.
- It injects those instances into the requesting class automatically.
- This process is recursive, so services that depend on other services are resolved in the same way.

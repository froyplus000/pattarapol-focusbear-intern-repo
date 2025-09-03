# NestJS CLI Reflection

### How does the NestJS CLI help streamline development?

- Automates repetitive scaffolding (modules, controllers, services), wiring them into the right modules.
- Provides consistent templates and structure, reducing setup time and human error.
- Includes commands for build/start/test, improving dev feedback loops.

### What is the purpose of `nest generate`?

- `nest generate` (alias `nest g`) creates boilerplate files for features and cross-cutting utilities.
- It can also auto-register the generated class with a target module using `--module`.

#### **Command I used to generate:**

```bash
nest g module users
nest g service users --module users
nest g controller users --module users
```

### How does using the CLI ensure consistency across the codebase?

- Schematics enforce standard file naming, locations, and code templates.
- Teams produce uniform controllers/services/guards/pipes, making the codebase easier to read and scale.

### What types of files and templates does the CLI create by default?

- **Feature basics**: `*.module.ts`, `*.controller.ts`, `*.service.ts` (+ `*.spec.ts` unless `--no-spec`).
- **Advanced**: guards, interceptors, pipes, filters, gateways, middleware, GraphQL resolvers.
- **Resource**: full CRUD scaffold (module + controller + service) for REST or GraphQL.

# Reflection — NestJS + TypeORM + PostgreSQL

## How does `@nestjs/typeorm` simplify database interactions?

- It integrates TypeORM with Nest’s DI container, so I can inject `Repository<Entity>` anywhere via `@InjectRepository`.
- Centralized config with `TypeOrmModule.forRoot(Async)` lets me load env vars and keep connection details in one place.
- `autoLoadEntities` removes manual entity registration friction in dev.
- Works naturally with Nest concepts (modules, pipes, guards, testing), keeping data access clean and testable.

## What is the difference between an entity and a repository in TypeORM?

- **Entity**: a class that maps to a database table (columns, relations, indexes) — the _shape and rules_ of my data.
- **Repository**: the data-access API bound to that entity — how I _create, read, update, delete, and query_ that data.
- I model structure with entities and perform operations via repositories; this separation keeps business logic clear.

## How does TypeORM handle migrations in a NestJS project?

TypeORM uses a **two-configuration approach** for migrations in NestJS:

1. **`ormconfig.ts`**: Separate DataSource config for CLI tools that loads environment variables and points to entities/migrations
2. **`app.module.ts`**: Runtime config with `migrations: [...]` and `migrationsRun: false` for production safety

**Workflow we implemented:**

- **Generate**: `npm run migration:generate src/migrations/DescriptiveName` compares entities to database schema
- **Build**: `npm run build` compiles TypeScript migrations to JavaScript
- **Apply**: `npm run migration:run` executes pending migrations in timestamp order
- **Rollback**: `npm run migration:revert` safely undoes the last migration

**Key lessons from our demo:**

- Always use **descriptive migration names** for team clarity
- Handle **existing data carefully** when adding NOT NULL columns (add nullable first, populate data, then set NOT NULL)
- Keep `synchronize: false` and rely on migrations for **controlled schema evolution**
- Review generated migrations before applying to catch potential data issues

This gives us **version-controlled, auditable database changes** that work consistently across development, staging, and production environments.

## What are the advantages of using PostgreSQL in a NestJS app?

- Strong relational integrity (FKs, constraints) plus advanced SQL features for reliable data modeling.
- **JSON/JSONB** support for semi-structured data alongside relational tables.
- Rich indexing and full-text search options; good performance for typical web workloads.
- Mature ecosystem (extensions like PostGIS/pgcrypto), open source, widely supported in cloud and tooling.

**Key takeaways for me:** keep `synchronize: false` outside of local experiments, rely on migrations, inject repositories through modules, and use Postgres’s strengths (constraints + JSONB) to keep data consistent while staying flexible.

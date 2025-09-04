# TypeORM Migrations Guide

This project uses TypeORM migrations for database schema management. This ensures that database changes are versioned, trackable, and can be applied consistently across different environments.

## Available Migration Commands

### Generate a new migration

```bash
npm run migration:generate src/migrations/MigrationName
```

This command compares your current entities with the database schema and generates a migration file with the necessary changes.

### Create a blank migration

```bash
npm run migration:create src/migrations/MigrationName
```

This creates an empty migration file that you can fill with custom SQL commands.

### Run pending migrations

```bash
npm run migration:run
```

This applies all pending migrations to the database.

### Revert the last migration

```bash
npm run migration:revert
```

This undoes the last applied migration.

## Migration Workflow

1. **Make changes to your entities** (e.g., add new columns, relationships)
2. **Generate a migration**: `npm run migration:generate src/migrations/DescriptiveName`
3. **Review the generated migration** to ensure it's correct
4. **Run the migration**: `npm run migration:run`

## Important Notes

- **Always review generated migrations** before running them
- **Test migrations in development** before applying to production
- **Backup your database** before running migrations in production
- **Migration files are automatically timestamped** to ensure proper ordering
- **The `synchronize` option is set to `false`** in production to prevent automatic schema changes

## Migration File Structure

Each migration implements two methods:

- `up()`: Contains the changes to apply
- `down()`: Contains the changes to revert (rollback)

Example:

```typescript
export class AddUserTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

## Environment Configuration

Migrations use the configuration from `ormconfig.ts`, which reads from your `.env` file:

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database username
- `DB_PASS`: Database password
- `DB_NAME`: Database name

## Best Practices

1. **Use descriptive migration names**: `AddUserEmailIndex`, `CreateOrdersTable`
2. **One logical change per migration**: Don't mix unrelated changes
3. **Always test rollbacks**: Ensure your `down()` method works correctly
4. **Handle data migration carefully**: When changing column types or constraints
5. **Use transactions**: Migrations run in transactions by default for safety
6. **Document complex migrations**: Add comments for complex logic

## Troubleshooting

### Migration fails due to data constraints

If a migration fails because of existing data (like adding a NOT NULL column), you need to:

1. Add the column as nullable first
2. Update existing records with appropriate values
3. Then make the column NOT NULL

### Rollback a migration

```bash
npm run migration:revert
```

### Check migration status

The migrations table in your database tracks which migrations have been applied.

## Production Deployment

1. **Stop the application**
2. **Backup the database**
3. **Run migrations**: `npm run migration:run`
4. **Start the application**

For zero-downtime deployments, ensure your migrations are backward-compatible.

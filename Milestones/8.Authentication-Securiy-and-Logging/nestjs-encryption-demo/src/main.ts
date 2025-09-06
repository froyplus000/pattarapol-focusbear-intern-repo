import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for frontend access
  app.enableCors();

  // Get port from environment or use default
  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log("🚀 NestJS TypeORM Encrypted Demo is running!");
  console.log(`📡 Server: http://localhost:${port}`);
  console.log(`🔐 Database: PostgreSQL with typeorm-encrypted`);
  console.log(`🐳 pgAdmin: http://localhost:5050 (admin@demo.com / admin123)`);
  console.log("\n📋 Available endpoints:");
  console.log("  POST   /users          - Create user with encrypted data");
  console.log("  GET    /users          - Get all users (decrypted)");
  console.log("  GET    /users/raw      - Get raw database values (encrypted)");
  console.log("  GET    /users/:id      - Get specific user (decrypted)");
  console.log("  DELETE /users/:id      - Delete user");
  console.log(
    "\n🔑 Encryption Key:",
    process.env.ENCRYPTION_KEY ? "Loaded from .env" : "Using fallback"
  );
}

bootstrap();

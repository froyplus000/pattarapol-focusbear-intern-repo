import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || "app",
        password: process.env.DB_PASS || "secret",
        database: process.env.DB_NAME || "appdb",
        // No entities in this hello-world demo; we only want to connect.
        // If you add entities later, either list them or use autoLoadEntities: true
        synchronize: false,
        // Let Nest's TypeORM wrapper retry while Postgres warms up
        retryAttempts: 10,
        retryDelay: 2000,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

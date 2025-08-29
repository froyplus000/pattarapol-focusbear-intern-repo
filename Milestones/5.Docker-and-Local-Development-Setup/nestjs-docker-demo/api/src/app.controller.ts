import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { DataSource } from "typeorm";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource
  ) {}

  @Get("/")
  hello() {
    return this.appService.getHello();
  }

  @Get("/db-ping")
  async dbPing() {
    // Simple connectivity check: SELECT 1
    await this.dataSource.query("SELECT 1");
    return { db: "ok" };
  }
}

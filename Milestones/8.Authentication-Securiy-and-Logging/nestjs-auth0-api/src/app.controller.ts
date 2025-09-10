import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RoleBasedAuthorizationGuard } from './authorization/role-based-authorization.guard';
import { Roles } from './authorization/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles('dog')
  @UseGuards(RoleBasedAuthorizationGuard)
  @Get('/dog')
  getDog(): string {
    return this.appService.getDog();
  }

  @Roles('cat')
  @UseGuards(RoleBasedAuthorizationGuard)
  @Get('/cat')
  getCat(): string {
    return this.appService.getCat();
  }
}

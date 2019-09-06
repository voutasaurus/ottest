import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) {};

  @Get()
  async getRoot(): Promise<string> {
    return await this.appService.getRoot();
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}

import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) {};

  @Get()
  async getRoot(@Request() req: any): Promise<string> {
    return await this.appService.getRoot(req);
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}

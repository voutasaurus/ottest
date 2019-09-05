import { Controller, Get, HttpService } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        // private readonly http: HttpService,
    ) {}

  @Get()
  getRoot(): string {
      var svc = process.env.SERVICES.split(',');
      var res = [];
      svc.forEach(function(url, index) {
          this.http.get(url).then(function (response) {
              res.push(response.data);
          });
      });
      return "NestJS root, other services: " + res.toString();
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}

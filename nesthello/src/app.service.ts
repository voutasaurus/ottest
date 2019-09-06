import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    private readonly http: HttpService,
  ) {};

  getHello(): string {
    return 'Hello Nest!';
  }

  async getRoot(): Promise<string> {
    var svc = process.env.SERVICES.split(',');
    var res = [];
    var self = this;
    for (const url of svc) {
      var response = await self.http.get(url).toPromise();
      res.push(response.data);
    };
    return "NestJS root, other services: " + res.toString();
  }
}

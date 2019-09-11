import { Injectable, HttpService } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { globalTracer, FORMAT_HTTP_HEADERS } from 'opentracing';

@Injectable()
export class AppService {
  constructor(
    private readonly http: HttpService,
  ) {};

  getHello(): string {
    return 'Hello Nest!';
  }

  async getRoot(req: any): Promise<string> {
      console.log("hit nestjs root");
      var sp = req.span;
      if (sp == null) {
        console.log("span null");
        sp = globalTracer().startSpan('nodejs get /');
      }

      var svc = process.env.SERVICES.split(',');
      var res = [];
      var self = this;
      for (const url of svc) {
      var headers : Headers | any = {};
      globalTracer().inject(sp, FORMAT_HTTP_HEADERS, headers);
      var outbound : AxiosRequestConfig = {
        method: 'GET',
        url: url,
        headers: headers,
      };
      var response = await self.http.request(outbound).toPromise<any>();
      res.push(response.data);
    };
    return "NestJS root, other services: " + res.toString();
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as etrace from 'express-opentracing';
import { initTracerFromEnv } from 'jaeger-client';

function initTracer(serviceName) {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
      logSpans: true,
    },
  };
  const options = {
    logger: {
      info(msg) {
        console.log("INFO ", msg);
      },
      error(msg) {
        console.log("ERROR", msg);
      },
    },
  };
  return initTracerFromEnv(config, options);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const tracer = initTracer("nest-hello");
  app.use(etrace.default({tracer: tracer}));
  await app.listen(3000);
}
bootstrap();

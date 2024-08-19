import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  //setting up cors and allow all origins
  app.register(fastifyCors, {
    origin: '*',
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(3000);
}
bootstrap();

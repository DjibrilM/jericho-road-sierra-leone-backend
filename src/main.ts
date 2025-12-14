import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { corsConfig, environment } from './util/constant';
import { WsAdapter } from '@nestjs/platform-ws';
import { Logger } from '@nestjs/common';

const log = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({ ...corsConfig });
  console.log(process.env.PORT);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT || 3001);

  log.log(`application started at  ${process.env.URL}`);
  log.log(
    `database connected successfully: ${environment === 'production' ? process.env.DB_URI : 'mongodb://localhost:27017/medicenter_local'}`,
  );
}

bootstrap();


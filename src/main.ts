import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

const DEFAULT_PORT = 3100;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Runs onModuleDestroy (Prisma $disconnect) on SIGTERM from docker stop
  app.enableShutdownHooks();
  // Start listening on the port
  await app.listen(process.env.PORT ?? DEFAULT_PORT);
}
await bootstrap();

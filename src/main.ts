// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common'; // Import NestJS Logger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  Logger.log(
    `[Bootstrap] Attempting to listen on port: ${port} (raw process.env.PORT: ${process.env.PORT})`,
    'Bootstrap',
  );

  try {
    await app.listen(port);
    // If app.listen() is successful, NestJS should log its own "listening" message.
    // We add our own as a fallback and confirmation.
    Logger.log(
      `[Bootstrap] Successfully called app.listen. Application SHOULD BE running on: http://localhost:${port}`,
      'Bootstrap',
    );
  } catch (error) {
    Logger.error(
      `[Bootstrap] Error during app.listen: ${error}`,
      error.stack,
      'Bootstrap',
    );
  }
}
bootstrap();

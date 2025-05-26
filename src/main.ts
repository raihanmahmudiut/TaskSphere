import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from '@nestjs/common'; // Import NestJS Logge
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TaskSphere API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  Logger.log(
    `[Bootstrap] Attempting to listen on port: ${port} (raw process.env.PORT: ${process.env.PORT})`,
    'Bootstrap',
  );

  try {
    await app.listen(port);
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

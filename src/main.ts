import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { DataGenerator } from './utils/data.generator';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const { httpAdapter } = app.get(HttpAdapterHost);
  // Втроим обработчик исключений AllExceptionsFilter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('posts API')
    .setDescription('rest api application to manage posts')
    .setVersion('1.0')
    .addTag('posts-api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  await app.listen(8000);
}
bootstrap();

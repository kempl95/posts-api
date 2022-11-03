import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { DataGenerator } from './utils/data.generator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const { httpAdapter } = app.get(HttpAdapterHost);
  // Втроим обработчик исключений AllExceptionsFilter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.init();
  await app.listen(8000);
}
bootstrap();

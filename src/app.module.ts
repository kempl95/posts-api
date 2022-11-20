import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { loggerMiddleware } from './middlewares/LoggerMiddleware';
import { DataGenerator } from './utils/data.generator';
import { PostModule } from './post/post.module';
import { Post } from './models/post.model';
import { PostController } from './post/post.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Post]),
    PostModule, DatabaseModule, HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, DataGenerator],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes(PostController);
  }
}

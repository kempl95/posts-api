import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { logger } from './middlewares/LoggerMiddleware';
import { DataGenerator } from './utils/data.generator';
import { PostModule } from './post/post.module';
import { User } from './model/user.model';
import { Post } from './model/post.model';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
        User, Post
    ]),
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataGenerator],
})
export class AppModule implements NestModule {
  //Подключим middleware. Попробую использовать для авторизации пользователя
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(UserController);
  }
}

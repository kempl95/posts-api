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
import { User } from './models/user.model';
import { Post } from './models/post.model';
import { UserService } from './user/user.service';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
        User, Post
    ]),
    UserModule, PostModule, JwtModule
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

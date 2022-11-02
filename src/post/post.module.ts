import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { User } from '../model/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [PostService],
  controllers: [PostController],
  exports: [],
})
export class UserModule {}

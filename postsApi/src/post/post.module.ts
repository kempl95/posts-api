import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  providers: [PostService],
  controllers: [PostController],
  exports: [],
})
export class PostModule {}

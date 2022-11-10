import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from '../models/post.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), HttpModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [],
})
export class PostModule {}

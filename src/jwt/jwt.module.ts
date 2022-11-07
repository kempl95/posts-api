import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from './jwt.service';
import { JwtController } from './jwt.controller';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

@Module({
  imports: [TypeOrmModule.forFeature([
    User
  ]),],
  providers: [JwtService],
  controllers: [JwtController],
  exports: [],
})
export class JwtModule {}

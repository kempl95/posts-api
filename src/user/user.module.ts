import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../model/user.model';
import { UserDataGenerator } from './user.data.generator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserDataGenerator],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}

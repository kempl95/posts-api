import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

@Module({
  imports: [HttpModule],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [],
})
export class DatabaseModule {}

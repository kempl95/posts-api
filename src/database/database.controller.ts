import {
  Controller,
  Post, Req, UseGuards,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AuthGuard } from '../utils/auth.guard';
import { Request } from 'express';
import { DatabaseResultDTO } from './databaseResultDTO';

@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}

  @Post('/restart')
  @UseGuards(AuthGuard)
  public async restart(@Req() request: Request): Promise<DatabaseResultDTO> {
    return await this.databaseService.restart(request);
  }

  @Post('/change')
  @UseGuards(AuthGuard)
  public async change(@Req() request: Request): Promise<string> {
    return await this.databaseService.changeDatabase(request);
  }
}

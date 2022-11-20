import {
  HttpException,
  HttpStatus,
  Injectable, Logger,
  NotFoundException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { exec, execSync, spawn } from 'child_process';
import { Request } from 'express';
import { DatabaseResultDTO } from './databaseResultDTO';

@Injectable()
export class DatabaseService {
  constructor() {}

  // Attempt to restart database if something wrong with it. Access only for Admin
  public async restart(request: Request): Promise<DatabaseResultDTO> {
    const accessToken = request.headers['access-token'];
    let decoded = jwt.decode(accessToken, {complete: true}) ;
    const { login } = decoded.payload;

    if (login !== 'admin') throw new HttpException('You have no right to restart database', HttpStatus.FORBIDDEN);

    //ToDo: make container_name in docker-compose file same as env.DATABASE_TYPE
    const currentDatabaseContainerName = String(process.env.DATABASE_TYPE) || 'postgres';

    const res = await this.cmd(`docker container restart ${currentDatabaseContainerName}`);
    const resultMassage = `container successfully restarted!`
    if (res === 0) Logger.debug(resultMassage);

    return new DatabaseResultDTO({result: resultMassage});
  }

  public async changeDatabase(request: Request): Promise<string> {
    const accessToken = request.headers['access-token'];
    let decoded = jwt.decode(accessToken, {complete: true}) ;
    const { login } = decoded.payload;

    if (login !== 'admin') throw new HttpException('You have no right to restart database', HttpStatus.FORBIDDEN);

    //ToDo: get chosen database from body/params and (before, if there is no connection to database run chosen docker-compose) change .env DATABASE_TYPE by cmd command and restart application
    return '';
  }

  public cmd(command) {
    let p = exec(command);
    return new Promise((resolveFunc) => {
      p.stdout.on("data", (x) => {
        Logger.debug(`container successfully restarted: ${x}`);
        return 'TEST';
      });
      p.stderr.on("data", (x) => {
        throw new HttpException(`Error during restarting database: ${x.toString()}`, HttpStatus.BAD_REQUEST);
      });
      p.on("exit", (code) => {
        resolveFunc(code);
      });
    });
  }


}

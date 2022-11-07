import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';
import { firstValueFrom, from } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequest(request);
  }

  async validateRequest(request: IncomingMessage): Promise<boolean> {
    const accessToken = request.headers['access-token'];
    if (!accessToken) throw new HttpException(`'access-token' key with value 'token_from_authentication_server' must be in headers`, HttpStatus.UNAUTHORIZED);

    const { login } = request['params'];
    if (!login) throw new HttpException(`'login' must be in params`, HttpStatus.UNAUTHORIZED);

    const userData = await firstValueFrom(
      from(this.userRepository.findOne({
        where: { login: login },
      })).pipe()
    );
    if (!userData) throw new HttpException(`user ${login} has not been found`, HttpStatus.UNAUTHORIZED);

    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if (err) throw new HttpException(`InvalidToken`, HttpStatus.UNAUTHORIZED);
      if (decoded) return true;
    });
  }
}
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { firstValueFrom, from } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { UserDTO } from '../user/user.dto';
import { HttpService } from '@nestjs/axios';
import { ValidationException } from './validation.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService
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

    let decoded = jwt.decode(accessToken, {complete: true}) ;
    if (!decoded) throw new ValidationException('Something wrong with access-token. Could not validate it', HttpStatus.UNAUTHORIZED);

    const { login } = decoded.payload;
    if (!login) throw new HttpException(`'login' must be in access token payload`, HttpStatus.UNAUTHORIZED);

    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if (err) throw new HttpException(`InvalidToken`, HttpStatus.UNAUTHORIZED);
      if (decoded) return true;
    });
  }
}
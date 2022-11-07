
import { JwtService } from './jwt.service';

import { Observable } from 'rxjs';
import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ValidationPipe } from '../utils/validation.pipe';
import { UserDTO } from '../user/user.dto';

@Controller('jwt')
export class JwtController {
  constructor(private jwtService: JwtService) {}

  @Get('/users/login/:login')
  getUserByLogin(
    @Param('login')
      login: string,
  ): Observable<UserDTO> {
    return this.jwtService.findByLogin(login);
  }
}

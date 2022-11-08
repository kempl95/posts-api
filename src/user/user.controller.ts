
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Observable } from 'rxjs';
import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ValidationPipe } from '../utils/validation.pipe';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public getAll(): Observable<UserDTO[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(
    //ParseIntPipe - Конвейеры / Pipes - трансформация/валидация входных данных
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Observable<UserDTO> {
    return this.userService.findById(id);
  }

  @Get('/login/:login')
  getUserByLogin(
    //ParseIntPipe - Конвейеры / Pipes - трансформация/валидация входных данных
    @Param('login')
      login: string,
  ): Observable<UserDTO> {
    return this.userService.findByLogin(login);
  }

  @Post()
  public post(@Body(new ValidationPipe()) dto: UserDTO): Promise<Observable<UserDTO>> {
    return this.userService.create(dto);
  }
}

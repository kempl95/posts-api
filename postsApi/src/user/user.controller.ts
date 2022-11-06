
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Observable } from 'rxjs';
import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public getAll(): Observable<Partial<UserDTO>> {
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

  @Post()
  public post(@Body() dto: UserDTO): Observable<UserDTO> {
    return this.userService.create(dto);
  }
}

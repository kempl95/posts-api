import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Observable } from 'rxjs';



@Controller('user')
export class UserController {

  constructor(private userService: UserService) { }

  @Get()
  public async getAll(): Promise<UserDTO[]> {
    return await this.userService.findAll()
  }

  @Get(':id')
  async getUser(
    //ParseIntPipe - Конвейеры / Pipes - трансформация/валидация входных данных
    @Param('id', new ParseIntPipe({
      errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number,
  ): Promise<UserDTO> {
    return await this.userService.findById(id);
  }

  @Get('/observable/:id')
  getUserObservable(
    //ParseIntPipe - Конвейеры / Pipes - трансформация/валидация входных данных
    @Param('id', new ParseIntPipe({
      errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number,
  ): Observable<Partial<UserDTO>> {
    return this.userService.findById2(id);
  }

  @Post()
  public async post(@Body() dto: UserDTO): Promise<UserDTO> {
    return this.userService.create(dto);
  }
}

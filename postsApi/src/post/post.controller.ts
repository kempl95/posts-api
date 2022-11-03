import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './post.dto';
import { Observable } from 'rxjs';
import { UserDTO } from '../user/user.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  public getAll(): Observable<Partial<PostDTO>> {
    return this.postService.findAll();
  }

  @Get(':id')
  findById(
    //ParseIntPipe - Конвейеры / Pipes - трансформация/валидация входных данных
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Observable<PostDTO> {
    return this.postService.findById(id);
  }

  @Get('/title/:title')
  findByTitle(
    //ParseIntPipe - Конвейеры / Pipes - трансформация/валидация входных данных
    @Param('title') title: string,
  ): Observable<PostDTO> {
    return this.postService.findByTitle(title);
  }

  @Post()
  public post(@Body() dto: PostDTO): Observable<PostDTO> {
    return this.postService.create(dto);
  }
}

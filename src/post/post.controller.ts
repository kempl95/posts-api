import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post, Req,
  UseFilters, UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './post.dto';
import { Observable } from 'rxjs';
import { AuthGuard } from '../utils/auth.guard';
import { ValidationPipe } from '../utils/validation.pipe';
import { Request } from 'express';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  public getAll(): Observable<PostDTO[]> {
    return this.postService.findAll();
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  findByUser(@Req() request: Request): Observable<PostDTO[]> {
    return this.postService.findByUserLogin(request);
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
  @UseGuards(AuthGuard)
  public post(@Body(new ValidationPipe()) dto: PostDTO, @Req() request: Request): Observable<PostDTO> {
    return this.postService.create(dto, request);
  }
}

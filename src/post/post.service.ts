import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDTO } from './post.dto';
import { Observable, from, mergeMap, throwIfEmpty, of, EMPTY } from 'rxjs';
import { Post } from '../models/post.model';
import { map } from 'rxjs/operators';
import { IncomingMessage } from "http";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public findAll(): Observable<PostDTO[]> {
    //Check given token
    const resQuery = this.postRepository.find();
    return from(resQuery).pipe(
      map((objs) => { return PostDTO.fromList(objs) })
    );
  }

  public findById(id: number): Observable<PostDTO> {
    const resQuery = this.postRepository.findOne({
      where: { id: id },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(PostDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`Post ${id} has not been found`),
      ),
    );
  }

  public findByTitle(title: string): Observable<PostDTO> {
    const resQuery = this.postRepository.findOne({
      where: { title: title },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(PostDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () =>
          new NotFoundException(`Post with title ${title} has not been found`),
      ),
    );
  }

  public findByUserLogin(login: string): Observable<PostDTO> {
    const resQuery = this.postRepository.findOne({
      where: { title: 'title' },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(PostDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () =>
          new NotFoundException(`Post with title ${'title'} has not been found`),
      ),
    );
  }

  public create(dto: PostDTO, request:IncomingMessage): Observable<PostDTO> {
    const accessToken = request.headers['access-token'];
    let decoded = jwt.decode(accessToken, {complete: true}) ;
    const { login } = decoded.payload;

    const resQuery = this.postRepository.save(dto.toEntity(dto, login));

    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(PostDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () =>
          new HttpException(`Post has not been saved`, HttpStatus.BAD_REQUEST),
      ),
    );
  }
}

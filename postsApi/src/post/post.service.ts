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
import { UserDTO } from '../user/user.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public findAll(): Observable<PostDTO[]> {
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

  public create(dto: PostDTO): Observable<PostDTO> {
    const resQuery = this.postRepository.save(dto.toEntity(dto));

    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(PostDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () =>
          new HttpException(`Post has not been saved`, HttpStatus.BAD_REQUEST),
      ),
    );
  }
}

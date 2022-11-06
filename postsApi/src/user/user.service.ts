import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { Observable, from, mergeMap, throwIfEmpty, of, EMPTY } from 'rxjs';
import { DataGenerator } from '../utils/data.generator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Observable<Partial<UserDTO>> {
    const resQuery = this.userRepository.find();
    return from(resQuery).pipe(
      mergeMap((objs) => objs.map((obj) => UserDTO.fromEntity(obj))),
    );
  }

  public findById(id: number): Observable<UserDTO> {
    const resQuery = this.userRepository.findOne({
      where: { id: id },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`User ${id} has not been found`),
      ),
    );
  }

  public create(dto: UserDTO): Observable<UserDTO> {
    const resQuery = this.userRepository.save(dto.toEntity(dto));

    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () =>
          new HttpException(`User has not been saved`, HttpStatus.BAD_REQUEST),
      ),
    );
  }
}

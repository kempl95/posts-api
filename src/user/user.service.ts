import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { EMPTY, from, mergeMap, Observable, of, throwIfEmpty } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Observable<UserDTO[]> {
    const resQuery = this.userRepository.find();
    return from(resQuery).pipe(
      map((objs) => { return UserDTO.fromList(objs, false) })
    );
  }

  public findById(id: number): Observable<UserDTO> {
    const resQuery = this.userRepository.findOne({
      where: { id: id },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntityWithoutPassword(obj)) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`User ${id} has not been found`),
      ),
    );
  }

  public findByLogin(login: string): Observable<UserDTO> {
    const resQuery = this.userRepository.findOne({
      where: { login: login },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntityWithoutPassword(obj)) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`User ${login} has not been found`),
      ),
    );
  }

  public create(dto: UserDTO): Observable<UserDTO> {
    const resQuery = this.userRepository.save(dto.toEntity(dto));

    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntityWithoutPassword(obj)) : EMPTY)),
      throwIfEmpty(
        () =>
          new HttpException(`User has not been saved`, HttpStatus.BAD_REQUEST),
      ),
    );
  }
}

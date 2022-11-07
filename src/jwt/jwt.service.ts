import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';
import { EMPTY, from, mergeMap, Observable, of, throwIfEmpty } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class JwtService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findByLogin(login: string): Observable<UserDTO> {
    const resQuery = this.userRepository.findOne({
      where: { login: login },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntity(obj)) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`User ${login} has not been found`),
      ),
    );
  }
}

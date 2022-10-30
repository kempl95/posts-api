import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.model';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { Observable, from, mergeMap, throwIfEmpty, of, EMPTY } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  public async findAll(): Promise<UserDTO[]> {
    try {
      const resQuery = await this.userRepository.find();
      return resQuery.map(e => UserDTO.fromEntity(e));
    } catch (e) {

    }
  }

  public async findById(id: number): Promise<UserDTO> {
    const resQuery = await this.userRepository.findOne({
      where: { id: id }
    });

    if (resQuery === null) throw new HttpException('Пользователь не найден', 400);
    return UserDTO.fromEntity(resQuery);
  }

  public findById2(id: number): Observable<Partial<UserDTO>> {
    const resQuery = this.userRepository.findOne({
      where: { id: id }
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntity(obj)) : EMPTY) ),
      throwIfEmpty(() => new NotFoundException(`Пользователь ${id} не найден`)),
    );
  }

  public async create(dto: UserDTO): Promise<UserDTO> {
    return this.userRepository.save(dto.toEntity(dto))
      .then(e => UserDTO.fromEntity(e));
  }
}

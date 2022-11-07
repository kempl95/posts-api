import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../models/user.model';

export class UserDTO implements Readonly<UserDTO> {
  @ApiProperty({ required: false })
  id: number;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  login: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  email: string;

  public static fromEntity(entity: User) {
    return new UserDTO({
      id: entity.id,
      name: entity.name,
      login: entity.login,
      password: entity.password,
      email: entity.email
    });
  }
  public static fromEntityWithoutPassword(entity: User) {
    return new UserDTO({
      id: entity.id,
      name: entity.name,
      login: entity.login,
      email: entity.email
    });
  }
  public static fromList(userList: User[], withPassword: boolean) {
    let list = [];
    for (const user of userList) {
      if (withPassword) list.push(UserDTO.fromEntity(user))
      else list.push(UserDTO.fromEntityWithoutPassword(user))
    }
    return list;
  }

  public toEntity(dto: UserDTO) {
    return new User({
      id: dto.id,
      name: dto.name,
      login: dto.login,
      password: dto.password,
      email: dto.email
    });
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

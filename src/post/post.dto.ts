import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Post } from '../models/post.model';

export class PostDTO {
  id: number;

  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  comment: string;

  @IsString()
  userLogin: string;

  public static fromEntity(entity: Post) {
    return new PostDTO({
      id: entity.id,
      title: entity.title,
      comment: entity.comment,
    });
  }
  public static fromList(userList: Post[]) {
    let list = [];
    for (const user of userList) {
      list.push(PostDTO.fromEntity(user));
    }
    return list;
  }
  public toEntity(dto: PostDTO, userLogin: string) {
    return new Post({
      title: dto.title,
      comment: dto.comment,
      userLogin: userLogin
    });
  }

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}

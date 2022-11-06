import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

export class PostDTO implements Readonly<PostDTO> {
  @ApiProperty({ required: false })
  id: number;

  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  comment: string;

  public static fromEntity(entity: Post) {
    return new PostDTO({
      id: entity.id,
      title: entity.title,
      comment: entity.comment,
    });
  }

  public toEntity(dto: PostDTO) {
    return new Post({
      id: dto.id,
      title: dto.title,
      comment: dto.comment,
    });
  }

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}

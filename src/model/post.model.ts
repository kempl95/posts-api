import { Entity, Column } from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @Column({
    type: 'integer',
    name: 'id',
    primary: true,
    generated: 'increment',
  })
  id: number;

  @Column({ type: 'varchar', length: 300, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: null, nullable: false })
  comment: string;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}

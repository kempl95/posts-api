import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}

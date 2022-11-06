import { Entity, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'user' })
export class User {
  @Column({
    type: 'integer',
    name: 'id',
    primary: true,
    generated: 'increment',
  })
  id: number;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  login: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  // @BeforeInsert()
  // async hashPassword() {
  //   console.log(`this.password: ${this.password}`);
  //   this.password = await bcrypt.hash(
  //     this.password,
  //     Number(process.env.HASH_SALT),
  //   );
  // }
  password: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  email: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

import { Repository } from 'typeorm';
import { User } from '../model/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { constants } from '../utils/Constants';
import { faker } from '@faker-js/faker';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class UserDataGenerator implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.generate();
  }

  public async generate(): Promise<void> {
    const resQuery = await this.userRepository.count();

    if (resQuery === 0) {
      await this.generateStaticUsers();
      await this.generateUsers();
    }
  }

  public async generateUsers(): Promise<void> {
    const users = [];
    for (let i = 0; i < constants.generator.userQTY; i++) {

      const firstName = faker.name.firstName('male');
      const lastName = faker.name.lastName('male');
      const password = await bcrypt.hash(`${firstName} ${lastName}`, 10);
      users.push(
        new User({
          name: `${firstName} ${lastName}`,
          login: `${firstName}_${lastName}`,
          password: password,
        }),
      );
    }
    await this.userRepository.save(users);
  }

  public async generateStaticUsers(): Promise<void> {
    const password = await bcrypt.hash(`admin`, 10);

     const user = new User( {
       name: 'Admin',
       login: 'admin',
       password: password,
     });
    await this.userRepository.save(user);
  }
}

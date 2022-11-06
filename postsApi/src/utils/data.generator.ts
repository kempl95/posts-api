import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { constants } from './Constants';
import { faker } from '@faker-js/faker';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Post } from '../models/post.model';

@Injectable()
export class DataGenerator implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.generate();
  }

  public async generate(): Promise<void> {
    const userQueryLength = await this.userRepository.count();
    const postQueryLength = await this.postRepository.count();
    if (userQueryLength === 0) {
      await this.generateStaticUsers();
      await this.generateUsers();
    }
    if (postQueryLength === 0) await this.generatePosts();
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

  public async generatePosts(): Promise<void> {
    const saveArray = [];
    const userQuery = await this.userRepository.find();

    for (let i = 0; i < constants.generator.postQTY; i++) {
      const rndInt = this.getRandomInt(0, userQuery.length);
      const paragraphLength = this.getRandomInt(2, 5);
      const user = userQuery[rndInt];
      saveArray.push(
        new Post({
          title: faker.random.word(),
          comment: faker.lorem.paragraph(paragraphLength),
          user: user
        }),
      );
    }
    await this.postRepository.save(saveArray);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}

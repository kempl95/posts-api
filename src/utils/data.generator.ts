import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { constants } from './constants';
import { faker } from '@faker-js/faker';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Post } from '../models/post.model';
import { UserDTO } from '../user/user.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DataGenerator implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly httpService: HttpService
  ) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.generate();
  }

  public async generate(): Promise<void> {
    const postQueryLength = await this.postRepository.count();
    if (postQueryLength === 0) await this.generatePosts();
  }

  public async generatePosts(): Promise<void> {
    const saveArray = [];
    const { data } = await firstValueFrom(
      this.httpService.get<UserDTO[]>(`${process.env.AUTH_APP_URL}:${process.env.AUTH_APP_PORT}/users`).pipe(),
    );

    for (let i = 0; i < constants.generator.postQTY; i++) {
      const rndInt = this.getRandomInt(0, data.length);
      const paragraphLength = this.getRandomInt(2, 5);
      saveArray.push(
        new Post({
          title: faker.random.word(),
          comment: faker.lorem.paragraph(paragraphLength),
          userLogin: data[rndInt].login
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

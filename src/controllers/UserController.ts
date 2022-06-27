import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Controller, Get, Path, Body, Delete, Post, Route } from 'tsoa';

export type UserCreationParams = Pick<User, 'firstName' | 'lastName' | 'age'>;

@Route('users')
export class UserController extends Controller {
  private userRepository = AppDataSource.getRepository(User);

  @Get()
  public async all() {
    return await this.userRepository.find();
  }

  @Get('{id}')
  public async one(@Path() id: number): Promise<User | void> {
    let user = await this.userRepository.findOneBy({ id: id });
    if (user) {
      return user;
    } else {
      this.setStatus(404);
      
      return;
    }
  }

  @Post()
  public async create(@Body() requestBody: UserCreationParams): Promise<User> {
    this.setStatus(201);
    return await this.userRepository.save(requestBody);
  }

  @Post('{id}')
  public async update(@Path() id: number, @Body() requestBody: UserCreationParams): Promise<User | void> {
    let userToUpdate = await this.userRepository.findOneBy({ id: id });
    if (userToUpdate) {
      return await this.userRepository.save(Object.assign(userToUpdate, requestBody));
    } else {
      this.setStatus(404);
      return;
    }
  }

  @Delete('{id}')
  public async remove(@Path() id: number): Promise<void> {
    let userToRemove = await this.userRepository.findOneBy({ id: id });
    if (userToRemove) {
      await this.userRepository.remove(userToRemove);
    } else {
      this.setStatus(404);
    }

    return;
  }
}

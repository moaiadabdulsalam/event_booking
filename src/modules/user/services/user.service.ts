import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateUserRepositoryInput,
  IUsersRepository,
  UpdateUserRepositoryInput,
} from '../interfaces/users-repository.interface';
import { USERS_REPOSITORY } from '../../../common/constants/injection-tokens';

@Injectable()
export class UserService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  private async ensureUserExists(id: string) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async createUser(data: CreateUserRepositoryInput) {
    const existingUser = await this.userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    return this.userRepository.createUser(data);
  }

  async updateUser(id: string, data: UpdateUserRepositoryInput) {
    const user = await this.ensureUserExists(id);
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.getUserByEmail(data.email);
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }
    return this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: string) {
    await this.ensureUserExists(id);
    return this.userRepository.deleteUser(id);
  }

  async getUserById(id: string) {
    await this.ensureUserExists(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }
}

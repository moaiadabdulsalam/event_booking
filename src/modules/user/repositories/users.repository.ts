import { Injectable } from '@nestjs/common';
import {
  CreateUserRepositoryInput,
  UpdateUserRepositoryInput,
  IUsersRepository,
} from '../interfaces/users-repository.interface';
import { PrismaService } from '../../../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserRepositoryInput) {
    return this.prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: data.isActive,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserRepositoryInput) {
    return this.prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        hashedRefreshToken: data.hashedRefreshToken,
        role: data.role,
        isActive: data.isActive,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}

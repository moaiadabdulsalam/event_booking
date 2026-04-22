import { Role, User } from '../../../../generated/prisma/client';

export interface CreateUserRepositoryInput {
  fullName: string;
  email: string;
  passwordHash: string;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateUserRepositoryInput {
  fullName?: string;
  email?: string;
  passwordHash?: string;
  role?: Role;
  isActive?: boolean;
}

export interface IUsersRepository {
    createUser(input: CreateUserRepositoryInput): Promise<User>;
    updateUser(id: string, input: UpdateUserRepositoryInput): Promise<User>;
    deleteUser(id: string): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
}
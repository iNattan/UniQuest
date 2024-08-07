import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: number): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  update(id: number, data: Prisma.UserUpdateInput): Promise<User>
}

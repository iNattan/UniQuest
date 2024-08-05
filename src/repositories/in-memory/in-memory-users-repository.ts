import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 1,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role,
      created_at: new Date(),
      system_deleted: null,
      system_date_deleted: null,
    }

    this.items.push(user)

    return user
  }
}

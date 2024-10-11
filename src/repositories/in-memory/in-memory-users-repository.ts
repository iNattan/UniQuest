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

  async findById(id: number) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findMany(filter?: string) {
    const filteredUsers = this.items.filter((user) => {
      const isActive = user.system_deleted === null

      if (!isActive) {
        return false
      }

      if (!filter) {
        return true
      }

      const matchesName = user.name.toLowerCase().includes(filter.toLowerCase())
      return matchesName 
    })

    return filteredUsers
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: this.items.length + 1,
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

  async update(id: number, data: Prisma.UserUpdateInput) {
    const userIndex = this.items.findIndex((item) => item.id === id)

    const user = this.items[userIndex]

    const updatedUser: User = {
      ...user,
      name: typeof data.name === 'string' ? data.name : user.name,
      email: typeof data.email === 'string' ? data.email : user.email,
      password_hash:
        typeof data.password_hash === 'string'
          ? data.password_hash
          : user.password_hash,
      role: typeof data.role === 'number' ? data.role : user.role,
    }
    this.items[userIndex] = updatedUser

    return updatedUser
  }

  async delete(id: number) {
    const userIndex = this.items.findIndex((item) => item.id === id)

    if (userIndex === -1) {
      return false
    }

    const user = this.items[userIndex]

    this.items[userIndex] = {
      ...user,
      system_deleted: id,
      system_date_deleted: new Date(),
    }

    return true
  }
}

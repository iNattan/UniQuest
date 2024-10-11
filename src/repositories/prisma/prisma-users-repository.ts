import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        system_deleted: null,
        email,
      },
    })

    return user
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findMany(filter?: string) {
    const users = await prisma.user.findMany({
      where: {
        system_deleted: null,
        ...(filter
          ? {
              OR: [
                { name: { contains: filter, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
    })

    return users
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: { id },
      data,
    })
    return user
  }

  async delete(id: number) {
    try {
      await prisma.user.update({
        where: { id },
        data: {
          system_deleted: id,
          system_date_deleted: new Date(),
        },
      })
      return true
    } catch (err) {
      return false
    }
  }
}

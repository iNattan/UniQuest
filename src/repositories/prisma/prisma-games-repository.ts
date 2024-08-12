import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { GamesRepository } from '../games-repository'

export class PrismaGamesRepository implements GamesRepository {
  async findById(id: number) {
    const game = await prisma.game.findUnique({
      where: {
        id,
      },
    })

    return game
  }

  async findMany(filter?: string) {
    const games = await prisma.game.findMany({
      where: {
        system_deleted: null,
        ...(filter ? { name: { contains: filter, mode: 'insensitive' } } : {}),
      },
    })

    return games
  }

  async create(data: Prisma.GameCreateInput) {
    const game = await prisma.game.create({
      data,
    })

    return game
  }

  async update(id: number, data: Prisma.GameUpdateInput) {
    const game = await prisma.game.update({
      where: { id },
      data,
    })
    return game
  }

  async delete(id: number) {
    try {
      await prisma.game.update({
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

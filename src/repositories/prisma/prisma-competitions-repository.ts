import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CompetitionsRepository } from '../competitions-repository'

export class PrismaCompetitionsRepository implements CompetitionsRepository {
  async findById(id: number) {
    const competition = await prisma.competition.findUnique({
      where: {
        id,
      },
    })

    return competition
  }

  async findMany(filter?: string) {
    const competitions = await prisma.competition.findMany({
      where: {
        system_deleted: null,
        ...(filter ? { title: { contains: filter, mode: 'insensitive' } } : {}),
      },
      include: {
        CompetitionGames: {
          include: {
            game: true, 
          },
        },
      },
    })

    return competitions
  }

  async create(data: Prisma.CompetitionCreateInput) {
    const competition = await prisma.competition.create({
      data,
    })

    return competition
  }

  async update(id: number, data: Prisma.CompetitionUpdateInput) {
    const competition = await prisma.competition.update({
      where: { id },
      data,
    })
    return competition
  }

  async delete(id: number) {
    try {
      await prisma.competition.update({
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

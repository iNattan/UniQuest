import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CompetitionsRepository } from '../competitions-repository'

export class PrismaCompetitionsRepository implements CompetitionsRepository {
  async findById(id: number) {
    const competition = await prisma.competition.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        date_event: true,
        start_registration: true,
        end_registration: true,
        min_participant: true,
        max_participant: true,
        local: true,
        description: true,
        image: true,
        image_name: true,
        regulation_name: true,
        created_at: true,
        system_deleted: true,
        system_date_deleted: true,
        CompetitionGames: {
          select: {
            id: true,
            local: true,
            date_game: true,
            competition_id: true,
            game_id: true,
            game: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
    })

    return competition
  }

  async findRegulationById(id: number) {
    const competition = await prisma.competition.findUnique({
      where: {
        id,
      },
      select: {
        regulation: true,
      },
    })

    return competition
  }

  async findManyImages() {
    const competitions = await prisma.competition.findMany({
      where: {
        system_deleted: null,
      },
      select: {
        id: true,
        image: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return competitions
  }

  async findMany(filter?: string) {
    const competitions = await prisma.competition.findMany({
      where: {
        system_deleted: null,
        ...(filter ? { title: { contains: filter, mode: 'insensitive' } } : {}),
      },
      select: {
        id: true,
        title: true,
        date_event: true,
        start_registration: true,
        end_registration: true,
        min_participant: true,
        max_participant: true,
        local: true,
        description: true,
        image_name: true,
        regulation_name: true,
        created_at: true,
        system_deleted: true,
        system_date_deleted: true,
        CompetitionGames: {
          select: {
            id: true,
            local: true,
            date_game: true,
            competition_id: true,
            game_id: true,
            game: {
              select: {
                name: true,
              },
            },
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

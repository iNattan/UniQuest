import { prisma } from '@/lib/prisma'
import { AllAgainstAllMatchesRepository } from '../all-against-all-matches-repository'
import { Prisma } from '@prisma/client'

export class PrismaAllAgainstAllMatchesRepository
  implements AllAgainstAllMatchesRepository
{
  async findByCompetitionAndGame(competitionId: number, gameId: number) {
    return await prisma.allAgainstAllMatch.findMany({
      where: {
        competition_id: competitionId,
        game_id: gameId,
      },
      select: {
        id: true,
        competition_id: true,
        game_id: true,
        round: true,
        game: {
          select: {
            name: true,
          },
        },
        AllAgainstAllPlacement: {
          select: {
            id: true,
            match_id: true,
            team_id: true,
            team: {
              select: {
                name: true,
              },
            },
            position: true,
            score: true,
          },
        },
      },
    })
  }

  async findById(id: number) {
    const match = await prisma.allAgainstAllMatch.findUnique({
      where: {
        id,
      },
    })

    return match
  }

  async create(data: Prisma.AllAgainstAllMatchCreateInput) {
    const match = await prisma.allAgainstAllMatch.create({
      data,
    })

    return match
  }

  async deleteMany(competitionId: number, gameId: number) {
    try {
      await prisma.allAgainstAllMatch.deleteMany({
        where: {
          competition_id: competitionId,
          game_id: gameId,
        },
      })
      return true
    } catch (err) {
      return false
    }
  }
}

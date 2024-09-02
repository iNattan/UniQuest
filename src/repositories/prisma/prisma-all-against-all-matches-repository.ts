import { prisma } from '@/lib/prisma'
import { AllAgainstAllMatchesRepository } from '../all-against-all-matches-repository'
import { AllAgainstAllMatch, Prisma } from '@prisma/client'

export class PrismaAllAgainstAllMatchesRepository
  implements AllAgainstAllMatchesRepository
{
  async findByCompetitionAndGame(
    competitionId: number,
    gameId: number,
  ): Promise<AllAgainstAllMatch[]> {
    return await prisma.allAgainstAllMatch.findMany({
      where: {
        competition_id: competitionId,
        game_id: gameId,
      },
    })
  }

  async findById(id: number): Promise<AllAgainstAllMatch | null> {
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

  async deleteMany(competitionId: number, gameId: number): Promise<boolean> {
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

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CompetitionGamesRepository } from '../competition-games-repository'

export class PrismaCompetitionGamesRepository
  implements CompetitionGamesRepository
{
  async findByCompetitionId(competitionId: number) {
    return await prisma.competitionGame.findMany({
      where: {
        competition_id: competitionId,
      },
    })
  }

  async createMany(data: Prisma.CompetitionGameCreateManyInput[]) {
    await prisma.competitionGame.createMany({
      data,
    })
  }

  async deleteByCompetitionId(id: number) {
    try {
      await prisma.competitionGame.deleteMany({
        where: {
          competition_id: id,
        },
      })
      return true
    } catch (err) {
      return false
    }
  }
}

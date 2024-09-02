import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { DirectConfrontationMatchesRepository } from '../direct-confrontation-matches-repository'

export class PrismaDirectConfrontationMatchesRepository
  implements DirectConfrontationMatchesRepository
{
  async findByCompetitionAndGame(competitionId: number, gameId: number) {
    return await prisma.directConfrontationMatch.findMany({
      where: {
        competition_id: competitionId,
        game_id: gameId,
      },
    })
  }

  async findByRoundAndMatch(
    competitionId: number,
    gameId: number,
    round: number,
    match: number,
  ) {
    return await prisma.directConfrontationMatch.findFirst({
      where: {
        competition_id: competitionId,
        game_id: gameId,
        round,
        match,
      },
    })
  }

  async findById(id: number) {
    const match = await prisma.directConfrontationMatch.findUnique({
      where: {
        id,
      },
    })

    return match
  }

  async createMany(data: Prisma.DirectConfrontationMatchCreateManyInput[]) {
    const matches = await prisma.directConfrontationMatch.createMany({
      data,
    })

    return matches
  }

  async update(id: number, data: Prisma.DirectConfrontationMatchUpdateInput) {
    const match = await prisma.directConfrontationMatch.update({
      where: { id },
      data,
    })
    return match
  }

  async deleteMany(competitionId: number, gameId: number) {
    try {
      await prisma.directConfrontationMatch.deleteMany({
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

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
      select: {
        id: true,
        competition_id: true,
        game_id: true,
        round: true,
        match: true,
        team1_id: true,
        team1: {
          select: {
            name: true,
          },
        },
        team2_id: true,
        team2: {
          select: {
            name: true,
          },
        },
        winner_team_id: true,
        winner_team: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
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

import { prisma } from '@/lib/prisma'
import { ScoresRepository } from '../scores-repository'
import { Prisma } from '@prisma/client'

export class PrismaScoresRepository implements ScoresRepository {
  async findByCompetitionIdAndGameIdAndTeamId(
    competitionId: number,
    gameId: number,
    teamId: number,
  ) {
    const score = await prisma.score.findFirst({
      where: {
        competition_id: competitionId,
        game_id: gameId,
        team_id: teamId,
      },
    })

    return score
  }

  async createMany(data: Prisma.ScoreCreateManyInput[]) {
    const scores = await prisma.score.createMany({
      data,
    })

    return scores
  }

  async update(id: number, score: number) {
    const scoreUpdated = await prisma.score.update({
      where: { id },
      data: { score },
    })
    return scoreUpdated
  }

  async updateForAllTeams(
    competitionId: number,
    gameId: number,
    score: number,
  ) {
    await prisma.score.updateMany({
      where: {
        competition_id: competitionId,
        game_id: gameId,
      },
      data: {
        score,
      },
    })
  }

  async deleteMany(competitionId: number, gameId: number) {
    try {
      await prisma.score.deleteMany({
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

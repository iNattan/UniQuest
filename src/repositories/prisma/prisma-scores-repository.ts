import { prisma } from '@/lib/prisma'
import { ScoresRepository } from '../scores-repository'

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

  async findOrCreateScore(
    competitionId: number,
    gameId: number,
    teamId: number,
  ) {
    const existingScore = await prisma.score.findFirst({
      where: {
        competition_id: competitionId,
        game_id: gameId,
        team_id: teamId,
      },
    })

    if (existingScore) {
      return existingScore
    }

    const newScore = await prisma.score.create({
      data: {
        competition_id: competitionId,
        game_id: gameId,
        team_id: teamId,
        score: 0,
      },
    })

    return newScore
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
}

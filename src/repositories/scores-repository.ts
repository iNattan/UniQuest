import { Score } from '@prisma/client'

export interface ScoresRepository {
  findByCompetitionIdAndGameIdAndTeamId(
    competitionId: number,
    gameId: number,
    teamId: number,
  ): Promise<Score | null>
  findOrCreateScore(
    competitionId: number,
    gameId: number,
    teamId: number,
  ): Promise<Score>
  update(id: number, score: number): Promise<Score>
  updateForAllTeams(
    competitionId: number,
    gameId: number,
    score: number,
  ): Promise<void>
}

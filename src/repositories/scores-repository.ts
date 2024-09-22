import { Prisma, Score } from '@prisma/client'

export interface ScoresRepository {
  findByCompetitionIdAndGameIdAndTeamId(
    competitionId: number,
    gameId: number,
    teamId: number,
  ): Promise<Score | null>
  createMany(data: Prisma.ScoreCreateManyInput[]): Promise<Prisma.BatchPayload>
  update(id: number, score: number): Promise<Score>
  updateForAllTeams(
    competitionId: number,
    gameId: number,
    score: number,
  ): Promise<void>
  deleteMany(competitionId: number, gameId: number): Promise<boolean>
}

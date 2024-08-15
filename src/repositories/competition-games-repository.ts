import { Prisma, CompetitionGame } from '@prisma/client'

export interface CompetitionGamesRepository {
  findByCompetitionId(competitionId: number): Promise<CompetitionGame[]>
  createMany(data: Prisma.CompetitionGameCreateManyInput[]): Promise<void>
  deleteByCompetitionId(id: number): Promise<boolean>
}

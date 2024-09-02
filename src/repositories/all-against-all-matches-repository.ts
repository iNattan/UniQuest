import { AllAgainstAllMatch, Prisma } from '@prisma/client'

export interface AllAgainstAllMatchesRepository {
  findByCompetitionAndGame(
    competitionId: number,
    gameId: number,
  ): Promise<AllAgainstAllMatch[]>
  findById(id: number): Promise<AllAgainstAllMatch | null>
  create(
    data: Prisma.AllAgainstAllMatchCreateInput,
  ): Promise<AllAgainstAllMatch>
  deleteMany(competitionId: number, gameId: number): Promise<boolean>
}

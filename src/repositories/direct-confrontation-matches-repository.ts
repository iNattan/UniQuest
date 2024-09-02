import { Prisma, DirectConfrontationMatch } from '@prisma/client'

export interface DirectConfrontationMatchesRepository {
  findByCompetitionAndGame(
    competitionId: number,
    gameId: number,
  ): Promise<DirectConfrontationMatch[]>
  findByRoundAndMatch(
    competitionId: number,
    gameId: number,
    round: number,
    match: number,
  ): Promise<DirectConfrontationMatch | null>
  findById(id: number): Promise<DirectConfrontationMatch | null>
  createMany(
    data: Prisma.DirectConfrontationMatchCreateManyInput[],
  ): Promise<Prisma.BatchPayload>
  update(
    id: number,
    data: Prisma.DirectConfrontationMatchUpdateInput,
  ): Promise<DirectConfrontationMatch>
  deleteMany(competitionId: number, gameId: number): Promise<boolean>
}

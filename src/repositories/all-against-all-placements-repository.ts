import { Prisma, AllAgainstAllPlacement } from '@prisma/client'

export interface AllAgainstAllPlacementsRepository {
  findByMatchId(matchId: number): Promise<AllAgainstAllPlacement[]>
  findById(id: number): Promise<AllAgainstAllPlacement | null>
  findByMatchIdAndTeamId(
    matchId: number,
    teamId: number,
  ): Promise<AllAgainstAllPlacement | null>
  createMany(
    data: Prisma.AllAgainstAllPlacementCreateManyInput[],
  ): Promise<Prisma.BatchPayload>
  update(
    id: number,
    data: Prisma.AllAgainstAllPlacementUpdateInput,
  ): Promise<AllAgainstAllPlacement>
  deleteMany(matchId: number): Promise<boolean>
}

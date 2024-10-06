import { prisma } from '@/lib/prisma'
import { Prisma, AllAgainstAllPlacement } from '@prisma/client'
import { AllAgainstAllPlacementsRepository } from '../all-against-all-placements-repository'

export class PrismaAllAgainstAllPlacementsRepository
  implements AllAgainstAllPlacementsRepository
{
  async findByMatchId(matchId: number) {
    return await prisma.allAgainstAllPlacement.findMany({
      where: {
        match_id: matchId,
      },
    })
  }

  async findById(id: number){
    return await prisma.allAgainstAllPlacement.findUnique({
      where: {
        id,
      },
    })
  }

  async findByMatchIdAndTeamId(
    matchId: number,
    teamId: number,
  ) {
    return await prisma.allAgainstAllPlacement.findFirst({
      where: {
        match_id: matchId,
        team_id: teamId,
      },
    })
  }

  async createMany(
    data: Prisma.AllAgainstAllPlacementCreateManyInput[],
  ) {
    return await prisma.allAgainstAllPlacement.createMany({
      data,
    })
  }

  async update(
    id: number,
    data: Prisma.AllAgainstAllPlacementUpdateInput,
  ) {
    return await prisma.allAgainstAllPlacement.update({
      where: { id },
      data,
    })
  }

  async deleteMany(matchId: number) {
    try {
      await prisma.allAgainstAllPlacement.deleteMany({
        where: {
          match_id: matchId,
        },
      })
      return true
    } catch (err) {
      return false
    }
  }
}

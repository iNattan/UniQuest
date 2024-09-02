import { prisma } from '@/lib/prisma'
import { Prisma, AllAgainstAllPlacement } from '@prisma/client'
import { AllAgainstAllPlacementsRepository } from '../all-against-all-placements-repository'

export class PrismaAllAgainstAllPlacementsRepository
  implements AllAgainstAllPlacementsRepository
{
  async findByMatchId(matchId: number): Promise<AllAgainstAllPlacement[]> {
    return await prisma.allAgainstAllPlacement.findMany({
      where: {
        match_id: matchId,
      },
    })
  }

  async findById(id: number): Promise<AllAgainstAllPlacement | null> {
    return await prisma.allAgainstAllPlacement.findUnique({
      where: {
        id,
      },
    })
  }

  async createMany(
    data: Prisma.AllAgainstAllPlacementCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return await prisma.allAgainstAllPlacement.createMany({
      data,
    })
  }

  async update(
    id: number,
    data: Prisma.AllAgainstAllPlacementUpdateInput,
  ): Promise<AllAgainstAllPlacement> {
    return await prisma.allAgainstAllPlacement.update({
      where: { id },
      data,
    })
  }

  async deleteMany(matchId: number): Promise<boolean> {
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

import { AllAgainstAllPlacement, Prisma } from '@prisma/client'
import { AllAgainstAllPlacementsRepository } from '../all-against-all-placements-repository'

export class InMemoryAllAgainstAllPlacementsRepository
  implements AllAgainstAllPlacementsRepository
{
  public items: AllAgainstAllPlacement[] = []

  async findByMatchId(matchId: number) {
    return this.items.filter((item) => item.match_id === matchId)
  }

  async findById(id: number) {
    const placement = this.items.find((item) => item.id === id)
    return placement || null
  }

  async findByMatchIdAndTeamId(matchId: number, teamId: number) {
    const placement = this.items.find(
      (item) => item.match_id === matchId && item.team_id === teamId,
    )
    return placement || null
  }

  async createMany(data: Prisma.AllAgainstAllPlacementCreateManyInput[]) {
    const newPlacements: AllAgainstAllPlacement[] = data.map((item, index) => ({
      id: this.items.length + 1 + index,
      match_id: item.match_id,
      team_id: item.team_id,
      score: item.score,
      position: item.position,
    }))

    this.items.push(...newPlacements)
    return { count: newPlacements.length }
  }

  async update(id: number, data: Prisma.AllAgainstAllPlacementUpdateInput) {
    const placementIndex = this.items.findIndex((item) => item.id === id)

    if (placementIndex === -1) {
      throw new Error('Placement not found')
    }

    const existingPlacement = this.items[placementIndex]
    const updatedPlacement: AllAgainstAllPlacement = {
      ...existingPlacement,
      score:
        typeof data.score === 'number' ? data.score : existingPlacement.score,
      position:
        typeof data.position === 'number'
          ? data.position
          : existingPlacement.position,
    }

    this.items[placementIndex] = updatedPlacement
    return updatedPlacement
  }

  async deleteMany(matchId: number) {
    const initialLength = this.items.length
    this.items = this.items.filter((item) => item.match_id !== matchId)
    return this.items.length < initialLength
  }
}

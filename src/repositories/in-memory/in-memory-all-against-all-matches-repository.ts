import { AllAgainstAllMatch, Prisma } from '@prisma/client'
import { AllAgainstAllMatchesRepository } from '../all-against-all-matches-repository'

export class InMemoryAllAgainstAllMatchesRepository
  implements AllAgainstAllMatchesRepository
{
  public items: AllAgainstAllMatch[] = []

  async findByCompetitionAndGame(competitionId: number, gameId: number) {
    return this.items.filter(
      (item) =>
        item.competition_id === competitionId && item.game_id === gameId,
    )
  }

  async findById(id: number) {
    const match = this.items.find((item) => item.id === id)
    return match || null
  }

  async create(data: Prisma.AllAgainstAllMatchCreateInput) {
    const newMatch: AllAgainstAllMatch = {
      id: this.items.length + 1,
      competition_id: data.competition.connect?.id ?? 0,
      game_id: data.game.connect?.id ?? 0,
      round: data.round,
    }

    this.items.push(newMatch)
    return newMatch
  }

  async deleteMany(competitionId: number, gameId: number) {
    const initialLength = this.items.length
    this.items = this.items.filter(
      (item) =>
        item.competition_id !== competitionId || item.game_id !== gameId,
    )
    return this.items.length < initialLength
  }
}

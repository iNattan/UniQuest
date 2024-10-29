import { CompetitionGame, Prisma } from '@prisma/client'
import { CompetitionGamesRepository } from '../competition-games-repository'

export class InMemoryCompetitionGamesRepository
  implements CompetitionGamesRepository
{
  public items: CompetitionGame[] = []

  async findByCompetitionId(competitionId: number) {
    return this.items.filter((item) => item.competition_id === competitionId)
  }

  async findByGameId(gameId: number) {
    return this.items.filter((item) => item.game_id === gameId)
  }

  async createMany(data: Prisma.CompetitionGameCreateManyInput[]) {
    const newGames: CompetitionGame[] = data.map((item, index) => ({
      id: this.items.length + 1 + index,
      competition_id: item.competition_id,
      game_id: item.game_id,
      local: item.local ?? '',
      date_game:
        typeof item.date_game === 'string'
          ? new Date(item.date_game)
          : item.date_game,
      created_at: new Date(),
    }))

    this.items.push(...newGames)
  }

  async deleteByCompetitionId(id: number) {
    const initialLength = this.items.length
    this.items = this.items.filter((item) => item.competition_id !== id)
    return this.items.length < initialLength
  }
}

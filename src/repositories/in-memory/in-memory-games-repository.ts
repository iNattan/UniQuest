import { Game, Prisma } from '@prisma/client'
import { GamesRepository } from '../games-repository'

export class InMemoryGamesRepository implements GamesRepository {
  public items: Game[] = []

  async findById(id: number) {
    const game = this.items.find((item) => item.id === id)
    return game || null
  }

  async findMany(filter?: string) {
    return this.items.filter((game) => {
      const isActive = game.system_deleted === null
      const matchesFilter = filter
        ? game.name.toLowerCase().includes(filter.toLowerCase())
        : true

      return isActive && matchesFilter
    })
  }

  async create(data: Prisma.GameCreateInput) {
    const newGame: Game = {
      id: this.items.length + 1,
      name: data.name,
      category: data.category,
      min_participant: data.min_participant ?? 1,
      max_participant: data.max_participant ?? 2,
      general_score: data.general_score ?? 0,
      first_score: data.first_score ?? 0,
      second_score: data.second_score ?? 0,
      third_score: data.third_score ?? 0,
      created_at: new Date(),
      system_deleted: null,
      system_date_deleted: null,
    }

    this.items.push(newGame)
    return newGame
  }

  async update(id: number, data: Prisma.GameUpdateInput) {
    const gameIndex = this.items.findIndex((item) => item.id === id)

    if (gameIndex === -1) {
      throw new Error('Game not found')
    }

    const existingGame = this.items[gameIndex]
    const updatedGame: Game = {
      ...existingGame,
      name: typeof data.name === 'string' ? data.name : existingGame.name,
      category:
        typeof data.category === 'number'
          ? data.category
          : existingGame.category,
      min_participant:
        typeof data.min_participant === 'number'
          ? data.min_participant
          : existingGame.min_participant,
      max_participant:
        typeof data.max_participant === 'number'
          ? data.max_participant
          : existingGame.max_participant,
      general_score:
        typeof data.general_score === 'number'
          ? data.general_score
          : existingGame.general_score,
      first_score:
        typeof data.first_score === 'number'
          ? data.first_score
          : existingGame.first_score,
      second_score:
        typeof data.second_score === 'number'
          ? data.second_score
          : existingGame.second_score,
      third_score:
        typeof data.third_score === 'number'
          ? data.third_score
          : existingGame.third_score,
    }

    this.items[gameIndex] = updatedGame
    return updatedGame
  }

  async delete(id: number) {
    const gameIndex = this.items.findIndex((item) => item.id === id)

    if (gameIndex === -1) {
      return false
    }

    this.items[gameIndex] = {
      ...this.items[gameIndex],
      system_deleted: id,
      system_date_deleted: new Date(),
    }

    return true
  }
}

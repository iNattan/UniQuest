import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteGameUseCase } from './delete'
import { InMemoryGamesRepository } from '@/repositories/in-memory/in-memory-games-repository'
import { NotFoundError } from '../errors/not-found-error'

let gamesRepository: InMemoryGamesRepository
let sut: DeleteGameUseCase

describe('Delete Game Use Case', () => {
  beforeEach(() => {
    gamesRepository = new InMemoryGamesRepository()
    sut = new DeleteGameUseCase(gamesRepository)
  })

  it('should be able to delete a game', async () => {
    const game = await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 1,
    })

    const wasDeleted = await sut.execute(game.id)

    expect(wasDeleted).toBe(true)
    expect(gamesRepository.items.length).toBe(1)
    expect(gamesRepository.items[0].system_deleted).toBe(game.id)
  })

  it('should throw NotFoundError if game does not exist', async () => {
    await expect(() => sut.execute(999)).rejects.toBeInstanceOf(NotFoundError)
  })
})

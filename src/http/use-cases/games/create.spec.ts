import { describe, it, expect, beforeEach } from 'vitest'
import { CreateGameUseCase } from './create'
import { InMemoryGamesRepository } from '@/repositories/in-memory/in-memory-games-repository'

let gamesRepository: InMemoryGamesRepository
let sut: CreateGameUseCase

describe('Create Game Use Case', () => {
  beforeEach(() => {
    gamesRepository = new InMemoryGamesRepository()
    sut = new CreateGameUseCase(gamesRepository)
  })

  it('should be able to create a new game', async () => {
    const { game } = await sut.execute({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 1,
    })

    expect(game.id).toEqual(expect.any(Number))
  })
})

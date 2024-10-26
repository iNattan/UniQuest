import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGamesRepository } from '@/repositories/in-memory/in-memory-games-repository'
import { GetGameByIdUseCase } from './get-by-id'

let gamesRepository: InMemoryGamesRepository
let sut: GetGameByIdUseCase

describe('Get Game By ID Use Case', () => {
  beforeEach(() => {
    gamesRepository = new InMemoryGamesRepository()
    sut = new GetGameByIdUseCase(gamesRepository)
  })

  it('should be able to get a game by ID', async () => {
    const createdGame = await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 0,
    })

    const { game } = await sut.execute({ id: createdGame.id })

    expect(game).toEqual(expect.objectContaining({ name: 'Game 1' }))
  })

  it('should return null if no game matches the ID', async () => {
    const { game } = await sut.execute({ id: 999 })

    expect(game).toBeNull()
  })
})

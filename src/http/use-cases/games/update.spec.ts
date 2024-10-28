import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGamesRepository } from '@/repositories/in-memory/in-memory-games-repository'
import { UpdateGameUseCase } from './update'
import { NotFoundError } from '../errors/not-found-error'

let gamesRepository: InMemoryGamesRepository
let sut: UpdateGameUseCase

describe('Update Game Use Case', () => {
  beforeEach(() => {
    gamesRepository = new InMemoryGamesRepository()
    sut = new UpdateGameUseCase(gamesRepository)
  })

  it('should be able to update game details', async () => {
    const createdGame = await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 1,
    })

    const { game } = await sut.execute({
      id: createdGame.id,
      name: 'Updated Game',
      min_participant: 3,
      max_participant: 6,
    })

    expect(game.name).toBe('Updated Game')
    expect(game.min_participant).toBe(3)
    expect(game.max_participant).toBe(6)
  })

  it('should be able to update game scores and category', async () => {
    const createdGame = await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 1,
    })

    const { game } = await sut.execute({
      id: createdGame.id,
      first_score: 20,
      second_score: 15,
      third_score: 10,
      category: 2,
    })

    expect(game.first_score).toBe(20)
    expect(game.second_score).toBe(15)
    expect(game.third_score).toBe(10)
    expect(game.category).toBe(2)
  })

  it('should not be able to update a non-existing game', async () => {
    await expect(() =>
      sut.execute({
        id: 999,
        name: 'Non Existing Game',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

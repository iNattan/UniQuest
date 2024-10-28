import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGamesRepository } from '@/repositories/in-memory/in-memory-games-repository'
import { GetGameUseCase } from './get'

let gamesRepository: InMemoryGamesRepository
let sut: GetGameUseCase

describe('Get Game Use Case', () => {
  beforeEach(() => {
    gamesRepository = new InMemoryGamesRepository()
    sut = new GetGameUseCase(gamesRepository)
  })

  it('should be able to get all games without filter', async () => {
    await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 0,
    })

    await gamesRepository.create({
      name: 'Game 2',
      min_participant: 3,
      max_participant: 6,
      first_score: 20,
      second_score: 15,
      third_score: 10,
      general_score: 2,
      category: 1,
    })

    const { games } = await sut.execute({})

    expect(games).toHaveLength(2)
    expect(games).toEqual([
      expect.objectContaining({ name: 'Game 1' }),
      expect.objectContaining({ name: 'Game 2' }),
    ])
  })

  it('should be able to get games with a filter', async () => {
    await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 0,
    })

    await gamesRepository.create({
      name: 'Game 2',
      min_participant: 3,
      max_participant: 6,
      first_score: 20,
      second_score: 15,
      third_score: 10,
      general_score: 2,
      category: 1,
    })

    await gamesRepository.create({
      name: 'Game 3',
      min_participant: 4,
      max_participant: 8,
      first_score: 30,
      second_score: 20,
      third_score: 10,
      general_score: 3,
      category: 3,
    })

    const { games } = await sut.execute({ filter: '1' })

    expect(games).toHaveLength(1)
    expect(games).toEqual([expect.objectContaining({ name: 'Game 1' })])
  })

  it('should return an empty array if no games match the filter', async () => {
    await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 1,
    })

    const { games } = await sut.execute({ filter: 'NonExistingGame' })

    expect(games).toHaveLength(0)
  })
})

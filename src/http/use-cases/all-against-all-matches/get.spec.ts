import { describe, it, expect, beforeEach } from 'vitest'
import { GetAllAgainstAllMatchUseCase } from './get'
import { InMemoryAllAgainstAllMatchesRepository } from '@/repositories/in-memory/in-memory-all-against-all-matches-repository'

let allAgainstAllMatchesRepository: InMemoryAllAgainstAllMatchesRepository
let sut: GetAllAgainstAllMatchUseCase

describe('Get All Against All Match Use Case', () => {
  beforeEach(() => {
    allAgainstAllMatchesRepository =
      new InMemoryAllAgainstAllMatchesRepository()
    sut = new GetAllAgainstAllMatchUseCase(allAgainstAllMatchesRepository)
  })

  it('should be able to get all-against-all matches by competition and game', async () => {
    await allAgainstAllMatchesRepository.create({
      competition: {
        connect: { id: 1 },
      },
      game: {
        connect: { id: 1 },
      },
      round: 1,
    })

    const { allAgainstAllMatches } = await sut.execute({
      competition_id: 1,
      game_id: 1,
    })

    expect(allAgainstAllMatches).toHaveLength(1)
    expect(allAgainstAllMatches[0]).toEqual(
      expect.objectContaining({
        id: 1,
        competition_id: 1,
        game_id: 1,
        round: 1,
      }),
    )
  })

  it('should return an empty array if no all-against-all matches are found', async () => {
    const { allAgainstAllMatches } = await sut.execute({
      competition_id: 1,
      game_id: 1,
    })

    expect(allAgainstAllMatches).toHaveLength(0)
  })
})

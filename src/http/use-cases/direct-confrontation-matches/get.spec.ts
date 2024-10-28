import { describe, it, expect, beforeEach } from 'vitest'
import { GetDirectConfrontationMatchUseCase } from './get'
import { InMemoryDirectConfrontationMatchesRepository } from '@/repositories/in-memory/in-memory-direct-confrontation-matches-repository'

let directConfrontationMatchesRepository: InMemoryDirectConfrontationMatchesRepository
let sut: GetDirectConfrontationMatchUseCase

describe('Get Direct Confrontation Match Use Case', () => {
  beforeEach(() => {
    directConfrontationMatchesRepository =
      new InMemoryDirectConfrontationMatchesRepository()
    sut = new GetDirectConfrontationMatchUseCase(
      directConfrontationMatchesRepository,
    )
  })

  it('should be able to get direct confrontation matches by competition and game', async () => {
    await directConfrontationMatchesRepository.createMany([
      {
        id: 1,
        competition_id: 1,
        game_id: 1,
        round: 1,
        match: 1,
        team1_id: 1,
        team2_id: 2,
        winner_team_id: null,
      },
      {
        id: 2,
        competition_id: 1,
        game_id: 1,
        round: 1,
        match: 2,
        team1_id: 3,
        team2_id: 4,
        winner_team_id: null,
      },
    ])

    const { directConfrontationMatches } = await sut.execute({
      competition_id: 1,
      game_id: 1,
    })

    expect(directConfrontationMatches).toHaveLength(2)
    expect(directConfrontationMatches).toEqual([
      expect.objectContaining({
        id: 1,
        competition_id: 1,
        game_id: 1,
        round: 1,
        match: 1,
        team1_id: 1,
        team2_id: 2,
      }),
      expect.objectContaining({
        id: 2,
        competition_id: 1,
        game_id: 1,
        round: 1,
        match: 2,
        team1_id: 3,
        team2_id: 4,
      }),
    ])
  })

  it('should return an empty array if no direct confrontation matches are found', async () => {
    const { directConfrontationMatches } = await sut.execute({
      competition_id: 1,
      game_id: 1,
    })

    expect(directConfrontationMatches).toHaveLength(0)
  })
})

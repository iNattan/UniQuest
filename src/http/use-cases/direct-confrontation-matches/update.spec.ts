import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryDirectConfrontationMatchesRepository } from '@/repositories/in-memory/in-memory-direct-confrontation-matches-repository'
import { UpdateDirectConfrontationMatchUseCase } from './update'
import { NotFoundError } from '../errors/not-found-error'

let directConfrontationMatchesRepository: InMemoryDirectConfrontationMatchesRepository
let sut: UpdateDirectConfrontationMatchUseCase

describe('Update Direct Confrontation Match Use Case', () => {
  beforeEach(() => {
    directConfrontationMatchesRepository = new InMemoryDirectConfrontationMatchesRepository()
    sut = new UpdateDirectConfrontationMatchUseCase(
      directConfrontationMatchesRepository,
    )
  })

  it('should be able to update a direct confrontation match with the winner team', async () => {
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
      {
        id: 3,
        competition_id: 1,
        game_id: 1,
        round: 2,
        match: 1,
        team1_id: null,
        team2_id: null,
        winner_team_id: null,
      },
    ])

    const { match } = await sut.execute({
      id: 1,
      winner_team_id: 1,
    })

    expect(match.winner_team_id).toBe(1)

    const updatedNextMatch = await directConfrontationMatchesRepository.findByRoundAndMatch(
      1,
      1,
      2,
      1,
    )

    expect(updatedNextMatch?.team1_id).toBe(1)
  })

  it('should be able to update the next match with the winner team of an even match', async () => {
    await directConfrontationMatchesRepository.createMany([
      {
        id: 1,
        competition_id: 1,
        game_id: 1,
        round: 1,
        match: 1,
        team1_id: 1,
        team2_id: 2,
        winner_team_id: 1,
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
      {
        id: 3,
        competition_id: 1,
        game_id: 1,
        round: 2,
        match: 1,
        team1_id: 1,
        team2_id: null,
        winner_team_id: null,
      },
    ])

    const { match } = await sut.execute({
      id: 2,
      winner_team_id: 3,
    })

    expect(match.winner_team_id).toBe(3)

    const updatedNextMatch = await directConfrontationMatchesRepository.findByRoundAndMatch(
      1,
      1,
      2,
      1,
    )

    expect(updatedNextMatch?.team2_id).toBe(3)
  })

  it('should throw NotFoundError if the direct confrontation match does not exist', async () => {
    await expect(() =>
      sut.execute({
        id: 999,
        winner_team_id: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

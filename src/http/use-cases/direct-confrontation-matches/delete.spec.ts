import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryDirectConfrontationMatchesRepository } from '@/repositories/in-memory/in-memory-direct-confrontation-matches-repository'
import { InMemoryScoresRepository } from '@/repositories/in-memory/in-memory-scores-repository'
import { DeleteDirectConfrontationMatchUseCase } from './delete'
import { NotFoundError } from '../errors/not-found-error'

let directConfrontationMatchesRepository: InMemoryDirectConfrontationMatchesRepository
let scoresRepository: InMemoryScoresRepository
let sut: DeleteDirectConfrontationMatchUseCase

describe('Delete Direct Confrontation Match Use Case', () => {
  beforeEach(() => {
    directConfrontationMatchesRepository =
      new InMemoryDirectConfrontationMatchesRepository()
    scoresRepository = new InMemoryScoresRepository()
    sut = new DeleteDirectConfrontationMatchUseCase(
      directConfrontationMatchesRepository,
      scoresRepository,
    )
  })

  it('should be able to delete direct confrontation matches and corresponding scores', async () => {
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

    await scoresRepository.createMany([
      { competition_id: 1, game_id: 1, team_id: 1, score: 0 },
      { competition_id: 1, game_id: 1, team_id: 2, score: 0 },
      { competition_id: 1, game_id: 1, team_id: 3, score: 0 },
      { competition_id: 1, game_id: 1, team_id: 4, score: 0 },
    ])

    const result = await sut.execute(1, 1)

    expect(result).toBe(true)

    const remainingMatches =
      await directConfrontationMatchesRepository.findByCompetitionAndGame(1, 1)
    expect(remainingMatches).toHaveLength(0)

    const remainingScores =
      await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, 1)
    expect(remainingScores).toBeNull()
  })

  it('should throw NotFoundError if direct confrontation matches do not exist', async () => {
    await expect(() => sut.execute(1, 1)).rejects.toBeInstanceOf(NotFoundError)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryDirectConfrontationMatchesRepository } from '@/repositories/in-memory/in-memory-direct-confrontation-matches-repository'
import { InMemoryScoresRepository } from '@/repositories/in-memory/in-memory-scores-repository'
import { CreateDirectConfrotationMatchUseCase } from './create'

let directConfrontationMatchesRepository: InMemoryDirectConfrontationMatchesRepository
let scoresRepository: InMemoryScoresRepository
let sut: CreateDirectConfrotationMatchUseCase

describe('Create Direct Confrontation Match Use Case', () => {
  beforeEach(() => {
    directConfrontationMatchesRepository = new InMemoryDirectConfrontationMatchesRepository()
    scoresRepository = new InMemoryScoresRepository()
    sut = new CreateDirectConfrotationMatchUseCase(
      directConfrontationMatchesRepository,
      scoresRepository,
    )
  })

  it('should be able to create direct confrontation matches and initialize scores', async () => {
    const { matches } = await sut.execute({
      competition_id: 1,
      game_id: 1,
      teams: [1, 2, 3, 4], 
    })

    expect(matches).toHaveLength(4) 
    for (const teamId of [1, 2, 3, 4]) {
      const score = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(
        1, 
        1, 
        teamId, 
      )
      expect(score).toEqual(
        expect.objectContaining({
          competition_id: 1,
          game_id: 1,
          team_id: teamId,
          score: 0, 
        }),
      )
    }
  })

  it('should create matches correctly with an odd number of teams', async () => {
    const { matches } = await sut.execute({
      competition_id: 1,
      game_id: 1,
      teams: [1, 2, 3, 4, 5], 
    })

    expect(matches).toHaveLength(8)
  })
})

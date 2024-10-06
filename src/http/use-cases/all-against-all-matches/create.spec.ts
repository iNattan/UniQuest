import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAllAgainstAllMatchUseCase } from './create'
import { InMemoryAllAgainstAllMatchesRepository } from '@/repositories/in-memory/in-memory-all-against-all-matches-repository'
import { InMemoryAllAgainstAllPlacementsRepository } from '@/repositories/in-memory/in-memory-all-against-all-placements-repository'
import { InMemoryScoresRepository } from '@/repositories/in-memory/in-memory-scores-repository'

let allAgainstAllMatchesRepository: InMemoryAllAgainstAllMatchesRepository
let allAgainstAllPlacementsRepository: InMemoryAllAgainstAllPlacementsRepository
let scoresRepository: InMemoryScoresRepository
let sut: CreateAllAgainstAllMatchUseCase

describe('Create All Against All Match Use Case', () => {
  beforeEach(() => {
    allAgainstAllMatchesRepository = new InMemoryAllAgainstAllMatchesRepository()
    allAgainstAllPlacementsRepository = new InMemoryAllAgainstAllPlacementsRepository()
    scoresRepository = new InMemoryScoresRepository()
    sut = new CreateAllAgainstAllMatchUseCase(
      allAgainstAllMatchesRepository,
      allAgainstAllPlacementsRepository,
      scoresRepository,
    )
  })

  it('should be able to create matches and initialize placements for all teams', async () => {
    const { matches } = await sut.execute({
      competition_id: 1,
      game_id: 1,
      number_of_rounds: 2,
      teams: [1, 2, 3, 4],
    })

    expect(matches).toHaveLength(2)

    const placements = await allAgainstAllPlacementsRepository.findByMatchId(matches[0].id)
    expect(placements).toHaveLength(4) 
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
})

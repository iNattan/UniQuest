import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteAllAgainstAllMatchUseCase } from './delete'
import { InMemoryAllAgainstAllMatchesRepository } from '@/repositories/in-memory/in-memory-all-against-all-matches-repository'
import { InMemoryAllAgainstAllPlacementsRepository } from '@/repositories/in-memory/in-memory-all-against-all-placements-repository'
import { InMemoryScoresRepository } from '@/repositories/in-memory/in-memory-scores-repository'
import { NotFoundError } from '../errors/not-found-error'

let allAgainstAllMatchesRepository: InMemoryAllAgainstAllMatchesRepository
let allAgainstAllPlacementsRepository: InMemoryAllAgainstAllPlacementsRepository
let scoresRepository: InMemoryScoresRepository
let sut: DeleteAllAgainstAllMatchUseCase

describe('Delete All Against All Match Use Case', () => {
  beforeEach(() => {
    allAgainstAllMatchesRepository =
      new InMemoryAllAgainstAllMatchesRepository()
    allAgainstAllPlacementsRepository =
      new InMemoryAllAgainstAllPlacementsRepository()
    scoresRepository = new InMemoryScoresRepository()
    sut = new DeleteAllAgainstAllMatchUseCase(
      allAgainstAllMatchesRepository,
      allAgainstAllPlacementsRepository,
      scoresRepository,
    )
  })

  it('should be able to delete all against all matches and corresponding placements and scores', async () => {
    await allAgainstAllMatchesRepository.create({
      competition: {
        connect: { id: 1 },
      },
      game: {
        connect: { id: 1 },
      },
      round: 1,
    })

    await allAgainstAllPlacementsRepository.createMany([
      { id: 1, match_id: 1, team_id: 1, score: 0, position: 0 },
      { id: 2, match_id: 1, team_id: 2, score: 0, position: 0 },
    ])

    await scoresRepository.createMany([
      { competition_id: 1, game_id: 1, team_id: 1, score: 0 },
      { competition_id: 1, game_id: 1, team_id: 2, score: 0 },
    ])

    const wasDeleted = await sut.execute(1, 1)

    expect(wasDeleted).toBe(true)

    const remainingMatches =
      await allAgainstAllMatchesRepository.findByCompetitionAndGame(1, 1)
    expect(remainingMatches).toHaveLength(0)

    const remainingPlacements =
      await allAgainstAllPlacementsRepository.findByMatchId(1)
    expect(remainingPlacements).toHaveLength(0)

    const remainingScores =
      await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, 1)
    expect(remainingScores).toBeNull()
  })

  it('should throw NotFoundError if all against all matches do not exist', async () => {
    await expect(() => sut.execute(1, 1)).rejects.toBeInstanceOf(NotFoundError)
  })
})

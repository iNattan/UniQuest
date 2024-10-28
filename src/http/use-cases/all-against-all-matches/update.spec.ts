import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateAllAgainstAllMatchUseCase } from './update'
import { InMemoryAllAgainstAllMatchesRepository } from '@/repositories/in-memory/in-memory-all-against-all-matches-repository'
import { InMemoryAllAgainstAllPlacementsRepository } from '@/repositories/in-memory/in-memory-all-against-all-placements-repository'
import { InMemoryGamesRepository } from '@/repositories/in-memory/in-memory-games-repository'
import { NotFoundError } from '../errors/not-found-error'

let allAgainstAllMatchesRepository: InMemoryAllAgainstAllMatchesRepository
let allAgainstAllPlacementsRepository: InMemoryAllAgainstAllPlacementsRepository
let gamesRepository: InMemoryGamesRepository
let sut: UpdateAllAgainstAllMatchUseCase

describe('Update All Against All Match Use Case', () => {
  beforeEach(() => {
    allAgainstAllMatchesRepository =
      new InMemoryAllAgainstAllMatchesRepository()
    allAgainstAllPlacementsRepository =
      new InMemoryAllAgainstAllPlacementsRepository()
    gamesRepository = new InMemoryGamesRepository()
    sut = new UpdateAllAgainstAllMatchUseCase(
      allAgainstAllMatchesRepository,
      allAgainstAllPlacementsRepository,
      gamesRepository,
    )
  })

  it('should be able to update placements for an all-against-all match', async () => {
    const game = await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 1,
    })

    const match = await allAgainstAllMatchesRepository.create({
      competition: { connect: { id: 1 } },
      game: { connect: { id: game.id } },
      round: 1,
    })

    await allAgainstAllPlacementsRepository.createMany([
      { id: 1, match_id: match.id, team_id: 1, position: 0, score: 0 },
      { id: 2, match_id: match.id, team_id: 2, position: 0, score: 0 },
      { id: 3, match_id: match.id, team_id: 3, position: 0, score: 0 },
    ])

    await sut.execute({
      match_id: match.id,
      placements: [
        { team_id: 1, position: 1 },
        { team_id: 2, position: 2 },
        { team_id: 3, position: 3 },
      ],
    })

    const updatedPlacements1 =
      await allAgainstAllPlacementsRepository.findByMatchIdAndTeamId(
        match.id,
        1,
      )
    const updatedPlacements2 =
      await allAgainstAllPlacementsRepository.findByMatchIdAndTeamId(
        match.id,
        2,
      )
    const updatedPlacements3 =
      await allAgainstAllPlacementsRepository.findByMatchIdAndTeamId(
        match.id,
        3,
      )

    expect(updatedPlacements1?.position).toBe(1)
    expect(updatedPlacements1?.score).toBe(15)
    expect(updatedPlacements2?.position).toBe(2)
    expect(updatedPlacements2?.score).toBe(10)
    expect(updatedPlacements3?.position).toBe(3)
    expect(updatedPlacements3?.score).toBe(5)
  })

  it('should throw NotFoundError if match does not exist', async () => {
    await expect(() =>
      sut.execute({
        match_id: 999,
        placements: [{ team_id: 1, position: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw NotFoundError if game does not exist', async () => {
    const match = await allAgainstAllMatchesRepository.create({
      competition: { connect: { id: 1 } },
      game: { connect: { id: 999 } },
      round: 1,
    })

    await expect(() =>
      sut.execute({
        match_id: match.id,
        placements: [{ team_id: 1, position: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw NotFoundError if a placement does not exist for a given team', async () => {
    const game = await gamesRepository.create({
      name: 'Game 1',
      min_participant: 2,
      max_participant: 4,
      first_score: 15,
      second_score: 10,
      third_score: 5,
      general_score: 1,
      category: 1,
    })

    const match = await allAgainstAllMatchesRepository.create({
      competition: { connect: { id: 1 } },
      game: { connect: { id: game.id } },
      round: 1,
    })

    await allAgainstAllPlacementsRepository.createMany([
      { id: 1, match_id: match.id, team_id: 1, position: 0, score: 0 },
    ])

    await expect(() =>
      sut.execute({
        match_id: match.id,
        placements: [
          { team_id: 1, position: 1 },
          { team_id: 2, position: 2 },
        ],
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

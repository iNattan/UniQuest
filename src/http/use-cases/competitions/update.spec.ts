import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateCompetitionUseCase } from './update'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'
import { InMemoryCompetitionGamesRepository } from '@/repositories/in-memory/in-memory-competition-games-repository'
import { NotFoundError } from '../errors/not-found-error'

let competitionsRepository: InMemoryCompetitionsRepository
let competitionGamesRepository: InMemoryCompetitionGamesRepository
let sut: UpdateCompetitionUseCase

describe('Update Competition Use Case', () => {
  beforeEach(() => {
    competitionsRepository = new InMemoryCompetitionsRepository()
    competitionGamesRepository = new InMemoryCompetitionGamesRepository()
    sut = new UpdateCompetitionUseCase(competitionsRepository, competitionGamesRepository)
  })

  it('should be able to update competition details', async () => {
    const createdCompetition = await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    const { competition } = await sut.execute({
      id: createdCompetition.id,
      title: 'Updated Competition',
      min_participant: 10,
      max_participant: 20,
      local: 'Updated Local',
    })

    expect(competition.title).toBe('Updated Competition')
    expect(competition.min_participant).toBe(10)
    expect(competition.max_participant).toBe(20)
    expect(competition.local).toBe('Updated Local')
  })

  it('should be able to update competition games', async () => {
    const createdCompetition = await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local 1',
    })

    const { competitionGames } = await sut.execute({
      id: createdCompetition.id,
      CompetitionGames: [
        {
          game_id: 1,
          local: 'Game Local 1',
          date_game: new Date(),
        },
        {
          game_id: 2,
          local: 'Game Local 2',
          date_game: new Date(),
        },
      ],
    })

    expect(competitionGames).toHaveLength(2)
    expect(competitionGames).toEqual([
      expect.objectContaining({ game_id: 1, local: 'Game Local 1' }),
      expect.objectContaining({ game_id: 2, local: 'Game Local 2' }),
    ])
  })

  it('should be able to update competition details and retain existing games', async () => {
    const createdCompetition = await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    await competitionGamesRepository.createMany([
      {
        competition_id: createdCompetition.id,
        game_id: 1,
        local: 'Game Local 1',
        date_game: new Date(),
      },
      {
        competition_id: createdCompetition.id,
        game_id: 2,
        local: 'Game Local 2',
        date_game: new Date(),
      },
    ])

    const { competition, competitionGames } = await sut.execute({
      id: createdCompetition.id,
      title: 'Updated Competition',
      min_participant: 10,
      max_participant: 20,
      local: 'Updated Local',
    })

    expect(competition.title).toBe('Updated Competition')
    expect(competition.min_participant).toBe(10)
    expect(competition.max_participant).toBe(20)
    expect(competition.local).toBe('Updated Local')
    expect(competitionGames).toHaveLength(2)
  })

  it('should not be able to update a non-existing competition', async () => {
    await expect(() =>
      sut.execute({
        id: 999,
        title: 'Non Existing Competition',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCompetitionUseCase } from './create'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'
import { InMemoryCompetitionGamesRepository } from '@/repositories/in-memory/in-memory-competition-games-repository'

let competitionsRepository: InMemoryCompetitionsRepository
let competitionGamesRepository: InMemoryCompetitionGamesRepository
let sut: CreateCompetitionUseCase

describe('Create Competition Use Case', () => {
  beforeEach(() => {
    competitionsRepository = new InMemoryCompetitionsRepository()
    competitionGamesRepository = new InMemoryCompetitionGamesRepository()
    sut = new CreateCompetitionUseCase(competitionsRepository, competitionGamesRepository)
  })

  it('should be able to create a new competition without games', async () => {
    const { competition, competitionGames } = await sut.execute({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      description: 'Test',
    })

    expect(competition.id).toEqual(expect.any(Number))
    expect(competitionGames).toHaveLength(0)
  })

  it('should be able to create a new competition with games', async () => {
    const { competition, competitionGames } = await sut.execute({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      description: 'Test',
      games: [
        { local: 'Game Local 1', date_game: new Date(), game_id: 1 },
        { local: 'Game Local 2', date_game: new Date(), game_id: 2 },
      ],
    })

    expect(competition.id).toEqual(expect.any(Number))
    expect(competitionGames).toHaveLength(2)
    expect(competitionGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ competition_id: competition.id, game_id: 1 }),
        expect.objectContaining({ competition_id: competition.id, game_id: 2 }),
      ]),
    )
  })

  it('should create the competition but not add any games if no games are provided', async () => {
    const { competition, competitionGames } = await sut.execute({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    expect(competition.id).toEqual(expect.any(Number))
    expect(competitionGames).toHaveLength(0)
  })
})

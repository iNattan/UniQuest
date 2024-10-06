import { describe, it, expect, beforeEach } from 'vitest'
import { GetScoresUseCase } from './get'
import { InMemoryScoresRepository } from '@/repositories/in-memory/in-memory-scores-repository'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { InMemoryCompetitionGamesRepository } from '@/repositories/in-memory/in-memory-competition-games-repository'
import { NotFoundError } from '../errors/not-found-error'

let scoresRepository: InMemoryScoresRepository
let teamsRepository: InMemoryTeamsRepository
let competitionGamesRepository: InMemoryCompetitionGamesRepository
let sut: GetScoresUseCase

describe('Get Scores Use Case', () => {
  beforeEach(() => {
    scoresRepository = new InMemoryScoresRepository()
    teamsRepository = new InMemoryTeamsRepository()
    competitionGamesRepository = new InMemoryCompetitionGamesRepository()
    sut = new GetScoresUseCase(
      scoresRepository,
      teamsRepository,
      competitionGamesRepository,
    )
  })

  it('should return the ranking with scores for each team and game', async () => {
    const team1 = await teamsRepository.create({
      name: 'Team A',
      competition: {
        connect: { id: 1 }, 
      },
      is_private: 0, 
      leader: {
        connect: { id: 1 },
      },
    })

    const team2 = await teamsRepository.create({
      name: 'Team B',
      competition: {
        connect: { id: 1 }, 
      },
      is_private: 0, 
      leader: {
        connect: { id: 2 },
      },
    })

    await competitionGamesRepository.createMany([
      {
        competition_id: 1,
        game_id: 1,
        local: 'Room 1',
        date_game: new Date(), 
      },
      {
        competition_id: 1,
        game_id: 2,
        local: 'Room 2',
        date_game: new Date(), 
      },
    ])

    await scoresRepository.createMany([
      { competition_id: 1, game_id: 1, team_id: team1.id, score: 10 },
      { competition_id: 1, game_id: 2, team_id: team1.id, score: 20 },
      { competition_id: 1, game_id: 1, team_id: team2.id, score: 30 },
      { competition_id: 1, game_id: 2, team_id: team2.id, score: 10 },
    ])

    const { ranking } = await sut.execute({ competition_id: 1 })

    expect(ranking).toHaveLength(2)
    expect(ranking[0].team_name).toBe('Team B')
    expect(ranking[0].total_score).toBe(40)
    expect(ranking[1].team_name).toBe('Team A')
    expect(ranking[1].total_score).toBe(30) 
  })

  it('should throw NotFoundError if there are no teams for the competition', async () => {
    await expect(() => sut.execute({ competition_id: 1 })).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw NotFoundError if there are no games for the competition', async () => {
    const team1 = await teamsRepository.create({
      name: 'Team A',
      competition: {
        connect: { id: 1 }, 
      },
      is_private: 0, 
      leader: {
        connect: { id: 1 },
      },
    })

    await expect(() => sut.execute({ competition_id: 1 })).rejects.toBeInstanceOf(NotFoundError)
  })
})

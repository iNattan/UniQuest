import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateScoresUseCase } from './update'
import { InMemoryScoresRepository } from '@/repositories/in-memory/in-memory-scores-repository'
import { InMemoryGamesRepository } from '@/repositories/in-memory/in-memory-games-repository'
import { InMemoryDirectConfrontationMatchesRepository } from '@/repositories/in-memory/in-memory-direct-confrontation-matches-repository'
import { InMemoryAllAgainstAllMatchesRepository } from '@/repositories/in-memory/in-memory-all-against-all-matches-repository'
import { InMemoryAllAgainstAllPlacementsRepository } from '@/repositories/in-memory/in-memory-all-against-all-placements-repository'
import { NotFoundError } from '../errors/not-found-error'

let scoresRepository: InMemoryScoresRepository
let gamesRepository: InMemoryGamesRepository
let directConfrontationMatchesRepository: InMemoryDirectConfrontationMatchesRepository
let allAgainstAllMatchesRepository: InMemoryAllAgainstAllMatchesRepository
let allAgainstAllPlacementsRepository: InMemoryAllAgainstAllPlacementsRepository
let sut: UpdateScoresUseCase

describe('Update Scores Use Case', () => {
  beforeEach(() => {
    scoresRepository = new InMemoryScoresRepository()
    gamesRepository = new InMemoryGamesRepository()
    directConfrontationMatchesRepository = new InMemoryDirectConfrontationMatchesRepository()
    allAgainstAllMatchesRepository = new InMemoryAllAgainstAllMatchesRepository()
    allAgainstAllPlacementsRepository = new InMemoryAllAgainstAllPlacementsRepository()

    sut = new UpdateScoresUseCase(
      scoresRepository,
      gamesRepository,
      directConfrontationMatchesRepository,
      allAgainstAllMatchesRepository,
      allAgainstAllPlacementsRepository,
    )
  })

  it('should update the scores for all teams based on the game category and placements', async () => {
    await gamesRepository.create({
      name: 'Game 1',
      min_participant: 1,
      max_participant: 2,
      category: 1, 
      general_score: 1,
      first_score: 15,
      second_score: 10,
      third_score: 5,
    })

    const team1 = { id: 1, name: 'Team A', competition_id: 1 }
    const team2 = { id: 2, name: 'Team B', competition_id: 1 }
    const team3 = { id: 3, name: 'Team C', competition_id: 1 }
    const team4 = { id: 4, name: 'Team D', competition_id: 1 }

    await scoresRepository.createMany([
      { competition_id: 1, game_id: 1, team_id: team1.id, score: 0 },
      { competition_id: 1, game_id: 1, team_id: team2.id, score: 0 },
      { competition_id: 1, game_id: 1, team_id: team3.id, score: 0 },
      { competition_id: 1, game_id: 1, team_id: team4.id, score: 0 },
    ])

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
      {
        id: 1,
        match_id: 1,
        team_id: team1.id,
        score: 15,
        position: 1,
      },
      {
        id: 2,
        match_id: 1,
        team_id: team2.id,
        score: 10,
        position: 2, 
      },
      {
        id: 3,
        match_id: 1,
        team_id: team3.id,
        score: 5,
        position: 3, 
      },
      {
        id: 4,
        match_id: 1,
        team_id: team4.id,
        score: 1,
        position: 4, 
      },
    ])
    

    const response = await sut.execute({
      competition_id: 1,
      game_id: 1,
    })

    expect(response.success).toBe(true)

    const updatedScores = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team1.id)
    expect(updatedScores?.score).toBe(15)

    const updatedScoreSecond = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team2.id)
    expect(updatedScoreSecond?.score).toBe(10) 

    const updatedScoreThird = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team3.id)
    expect(updatedScoreThird?.score).toBe(5) 
    
    const updatedScoreFourth = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team4.id)
    expect(updatedScoreFourth?.score).toBe(1) 
  })

  it('should update scores correctly for direct confrontation games', async () => {
    await gamesRepository.create({
      name: 'Game 1',
      min_participant: 1,
      max_participant: 2,
      category: 0,
      general_score: 1,
      first_score: 15,
      second_score: 10,
      third_score: 5,
    })
  
    const team1 = { id: 1, name: 'Team A', competition_id: 1 }
    const team2 = { id: 2, name: 'Team B', competition_id: 1 }
    const team3 = { id: 3, name: 'Team C', competition_id: 1 }
    const team4 = { id: 4, name: 'Team D', competition_id: 1 }
  
    await scoresRepository.createMany([
      { competition_id: 1, game_id: 1, team_id: team1.id, score: 0 },
      { competition_id: 1, game_id: 1, team_id: team2.id, score: 0 },
      { competition_id: 1, game_id: 1, team_id: team3.id, score: 0 },
      { competition_id: 1, game_id: 1, team_id: team4.id, score: 0 },
    ])
  
    await directConfrontationMatchesRepository.createMany([
      {
        id: 1,
        competition_id: 1,
        game_id: 1,
        round: 1,
        match: 1,
        team1_id: team1.id,
        team2_id: team2.id,
        winner_team_id: team1.id, 
      },
      {
        id: 2,
        competition_id: 1,
        game_id: 1,
        round: 1,
        match: 2,
        team1_id: team3.id,
        team2_id: team4.id,
        winner_team_id: team3.id, 
      },
    ])
  
    const response = await sut.execute({
      competition_id: 1,
      game_id: 1,
    })
  
    expect(response.success).toBe(true)
  
    const updatedScoreFirst = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team1.id)
    expect(updatedScoreFirst?.score).toBe(15) 
  
    const updatedScoreSecond = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team2.id)
    expect(updatedScoreSecond?.score).toBe(10)
  
    const updatedScoreThird = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team3.id)
    expect(updatedScoreThird?.score).toBe(5)

    const updatedScoreFourth = await scoresRepository.findByCompetitionIdAndGameIdAndTeamId(1, 1, team4.id)
    expect(updatedScoreFourth?.score).toBe(1)
  })  
})

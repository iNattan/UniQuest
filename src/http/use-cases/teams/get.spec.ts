import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { GetTeamUseCase } from './get'

let teamsRepository: InMemoryTeamsRepository
let sut: GetTeamUseCase

describe('Get Team Use Case', () => {
  beforeEach(() => {
    teamsRepository = new InMemoryTeamsRepository()
    sut = new GetTeamUseCase(teamsRepository)
  })

  it('should be able to get all teams without filter', async () => {
    await teamsRepository.create({
      name: 'Team A',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    await teamsRepository.create({
      name: 'Team B',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 2 } },
    })

    const { teams } = await sut.execute({ competitionId: 1 })

    expect(teams).toHaveLength(2)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'Team A' }),
      expect.objectContaining({ name: 'Team B' }),
    ])
  })

  it('should be able to get teams with a filter', async () => {
    await teamsRepository.create({
      name: 'Team A',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    await teamsRepository.create({
      name: 'Team B',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 2 } },
    })

    await teamsRepository.create({
      name: 'Team C',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 3 } },
    })

    const { teams } = await sut.execute({ competitionId: 1, filter: 'Team' })

    expect(teams).toHaveLength(3)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'Team A' }),
      expect.objectContaining({ name: 'Team B' }),
      expect.objectContaining({ name: 'Team C' }),
    ])
  })

  it('should return an empty array if no teams match the filter', async () => {
    await teamsRepository.create({
      name: 'Team A',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    const { teams } = await sut.execute({
      competitionId: 1,
      filter: 'NonExistingTeam',
    })

    expect(teams).toHaveLength(0)
  })
})

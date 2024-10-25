import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { GetTeamsRegisteredUseCase } from './get-registered'

let teamsRepository: InMemoryTeamsRepository
let sut: GetTeamsRegisteredUseCase

describe('Get Teams Registered Use Case', () => {
  beforeEach(() => {
    teamsRepository = new InMemoryTeamsRepository()
    sut = new GetTeamsRegisteredUseCase(teamsRepository)
  })

  it('should be able to get all registered teams for a competition', async () => {
    await teamsRepository.create({
      name: 'Team A',
      is_private: 0,
      competition: { connect: { id: 1 } },
      status: 0,
      leader: { connect: { id: 1 } },
    })

    await teamsRepository.create({
      name: 'Team B',
      is_private: 0,
      competition: { connect: { id: 1 } },
      status: 1,
      leader: { connect: { id: 2 } },
    })

    await teamsRepository.create({
      name: 'Team C',
      is_private: 0,
      competition: { connect: { id: 1 } },
      status: -1,
      leader: { connect: { id: 3 } },
    })

    const { teams } = await sut.execute({ competitionId: 1 })

    expect(teams).toHaveLength(1)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'Team B' }),
    ])
  })

  it('should return an empty array if no teams are registered for the competition', async () => {
    await teamsRepository.create({
      name: 'Team A',
      is_private: 0,
      competition: { connect: { id: 1 } },
      status: -1,
      leader: { connect: { id: 1 } },
    })

    const { teams } = await sut.execute({ competitionId: 1 })

    expect(teams).toHaveLength(0)
  })
})

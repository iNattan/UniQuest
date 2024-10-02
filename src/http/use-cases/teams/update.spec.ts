import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { UpdateTeamUseCase } from './update' 
import { hash, compare } from 'bcryptjs'
import { NotFoundError } from '../errors/not-found-error'

let teamsRepository: InMemoryTeamsRepository
let sut: UpdateTeamUseCase

describe('Update Team Use Case', () => {
  beforeEach(() => {
    teamsRepository = new InMemoryTeamsRepository()
    sut = new UpdateTeamUseCase(teamsRepository)
  })

  it('should be able to update team details', async () => {
    const createdTeam = await teamsRepository.create({
      name: 'Team A',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    const { team } = await sut.execute({
      id: createdTeam.id,
      name: 'Team A Updated',
      status: 1,
    })

    expect(team.name).toBe('Team A Updated')
    expect(team.status).toBe(1)
  })

  it('should be able to update the team password', async () => {
    const createdTeam = await teamsRepository.create({
      name: 'Team B',
      is_private: 1,
      password_hash: await hash('123456', 6),
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    const { team } = await sut.execute({
      id: createdTeam.id,
      password: 'newpassword',
    })

    const isPasswordCorrectlyHashed = await compare('newpassword', team.password_hash ?? '')
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to update a non-existing team', async () => {
    await expect(() =>
      sut.execute({
        id: 999,
        name: 'Non Existing Team',
        status: 0,
      })
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

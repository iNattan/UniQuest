import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { DeleteTeamUseCase } from './delete'
import { NotFoundError } from '../errors/not-found-error'

let teamsRepository: InMemoryTeamsRepository
let sut: DeleteTeamUseCase

describe('Delete Team Use Case', () => {
  beforeEach(() => {
    teamsRepository = new InMemoryTeamsRepository()
    sut = new DeleteTeamUseCase(teamsRepository)
  })

  it('should be able to delete a team', async () => {
    const createdTeam = await teamsRepository.create({
      name: 'Team A',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    const wasDeleted = await sut.execute(createdTeam.id)

    expect(wasDeleted).toBe(true)
    expect(teamsRepository.items.length).toBe(1) 
    expect(teamsRepository.items[0].system_deleted).toBe(createdTeam.id) 
  })

  it('should not be able to delete a non-existing team', async () => {
    await expect(() => sut.execute(999)).rejects.toBeInstanceOf(NotFoundError)
  })
})

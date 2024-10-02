import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTeamMembersRepository } from '@/repositories/in-memory/in-memory-team-members-repository'
import { DeleteTeamMemberUseCase } from './delete' 
import { NotFoundError } from '../errors/not-found-error'

let teamMembersRepository: InMemoryTeamMembersRepository
let sut: DeleteTeamMemberUseCase

describe('Delete Team Member Use Case', () => {
  beforeEach(() => {
    teamMembersRepository = new InMemoryTeamMembersRepository()
    sut = new DeleteTeamMemberUseCase(teamMembersRepository)
  })

  it('should be able to delete a team member', async () => {
    const createdTeamMember = await teamMembersRepository.create({
      user: { connect: { id: 1 } },
      team: { connect: { id: 1 } },
    })

    const wasDeleted = await sut.execute(createdTeamMember.user_id, createdTeamMember.team_id)

    expect(wasDeleted).toBe(true)
    expect(teamMembersRepository.members.length).toBe(0) 
  })

  it('should not be able to delete a non-existing team member', async () => {
    await expect(() =>
      sut.execute(999, 999) 
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw NotFoundError if the user is not part of the team', async () => {
    await teamMembersRepository.create({
      user: { connect: { id: 1 } },
      team: { connect: { id: 1 } },
    })

    await expect(() =>
      sut.execute(2, 1) 
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw NotFoundError if the team does not exist for the user', async () => {
    await teamMembersRepository.create({
      user: { connect: { id: 1 } },
      team: { connect: { id: 1 } },
    })

    await expect(() =>
      sut.execute(1, 2) 
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

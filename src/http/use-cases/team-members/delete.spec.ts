import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTeamMembersRepository } from '@/repositories/in-memory/in-memory-team-members-repository'
import { DeleteTeamMemberUseCase } from './delete'
import { NotFoundError } from '../errors/not-found-error'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'

let teamMembersRepository: InMemoryTeamMembersRepository
let teamsRepository: InMemoryTeamsRepository
let competitionsRepository: InMemoryCompetitionsRepository
let sut: DeleteTeamMemberUseCase

describe('Delete Team Member Use Case', () => {
  beforeEach(() => {
    teamMembersRepository = new InMemoryTeamMembersRepository()
    teamsRepository = new InMemoryTeamsRepository()
    competitionsRepository = new InMemoryCompetitionsRepository()
    sut = new DeleteTeamMemberUseCase(
      teamMembersRepository,
      teamsRepository,
      competitionsRepository,
    )
  })

  it('should be able to delete a team member', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      description: 'Test',
    })

    const createdTeam = await teamsRepository.create({
      competition: { connect: { id: 1 } },
      name: 'Team A',
      is_private: 0,
      leader: { connect: { id: 1 } },
    })

    const createdTeamMember = await teamMembersRepository.create({
      user: { connect: { id: 1 } },
      team: { connect: { id: createdTeam.id } },
    })

    const wasDeleted = await sut.execute(
      createdTeamMember.user_id,
      createdTeamMember.team_id,
    )

    expect(wasDeleted).toBe(true)
    expect(teamMembersRepository.members.length).toBe(0)
  })

  it('should not be able to delete a non-existing team member', async () => {
    await expect(() => sut.execute(999, 999)).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('should throw NotFoundError if the user is not part of the team', async () => {
    await teamMembersRepository.create({
      user: { connect: { id: 1 } },
      team: { connect: { id: 1 } },
    })

    await expect(() => sut.execute(2, 1)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw NotFoundError if the team does not exist for the user', async () => {
    await teamMembersRepository.create({
      user: { connect: { id: 1 } },
      team: { connect: { id: 1 } },
    })

    await expect(() => sut.execute(1, 2)).rejects.toBeInstanceOf(NotFoundError)
  })
})

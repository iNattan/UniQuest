import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { InMemoryTeamMembersRepository } from '@/repositories/in-memory/in-memory-team-members-repository'
import { CreateTeamMemberUseCase } from './create'
import { hash } from 'bcryptjs'
import { NotFoundError } from '../errors/not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'

let teamMembersRepository: InMemoryTeamMembersRepository
let teamsRepository: InMemoryTeamsRepository
let competitionsRepository: InMemoryCompetitionsRepository
let sut: CreateTeamMemberUseCase

describe('Create Team Member Use Case', () => {
  beforeEach(() => {
    teamMembersRepository = new InMemoryTeamMembersRepository()
    teamsRepository = new InMemoryTeamsRepository()
    competitionsRepository = new InMemoryCompetitionsRepository()

    competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      description: 'Test',
    })

    sut = new CreateTeamMemberUseCase(
      teamMembersRepository,
      teamsRepository,
      competitionsRepository,
    )
  })

  it('should be able to add a member to a public team without password', async () => {
    const createdTeam = await teamsRepository.create({
      name: 'Public Team',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    const { teamMember } = await sut.execute({
      user_id: 2,
      team_id: createdTeam.id,
    })

    expect(teamMember.id).toEqual(expect.any(Number))
    expect(teamMember.team_id).toBe(createdTeam.id)
    expect(teamMember.user_id).toBe(2)
  })

  it('should be able to add a member to a private team with correct password', async () => {
    const createdTeam = await teamsRepository.create({
      name: 'Private Team',
      is_private: 1,
      password_hash: await hash('correct_password', 6),
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    const { teamMember } = await sut.execute({
      user_id: 2,
      team_id: createdTeam.id,
      password: 'correct_password',
    })

    expect(teamMember.id).toEqual(expect.any(Number))
    expect(teamMember.team_id).toBe(createdTeam.id)
    expect(teamMember.user_id).toBe(2)
  })

  it('should not be able to add a member to a private team without password', async () => {
    const createdTeam = await teamsRepository.create({
      name: 'Private Team No Password',
      is_private: 1,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    await expect(() =>
      sut.execute({
        user_id: 2,
        team_id: createdTeam.id,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to add a member to a non-existing team', async () => {
    await expect(() =>
      sut.execute({
        user_id: 1,
        team_id: 999,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

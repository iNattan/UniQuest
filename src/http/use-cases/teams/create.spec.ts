import { expect, describe, it, beforeEach } from 'vitest'
import { CreateTeamUseCase } from './create'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { InMemoryTeamMembersRepository } from '@/repositories/in-memory/in-memory-team-members-repository'
import { compare } from 'bcryptjs'

let teamsRepository: InMemoryTeamsRepository
let teamMembersRepository: InMemoryTeamMembersRepository
let sut: CreateTeamUseCase

describe('Create Team Use Case', () => {
  beforeEach(() => {
    teamsRepository = new InMemoryTeamsRepository()
    teamMembersRepository = new InMemoryTeamMembersRepository()
    sut = new CreateTeamUseCase(teamsRepository, teamMembersRepository)
  })

  it('should be able to register a new team and add the leader as a team member', async () => {
    const leaderUserId = 1

    const { team } = await sut.execute({
      competition_id: 1,
      name: 'Team A',
      is_private: 0,
      leader_user_id: leaderUserId,
    })

    expect(team.id).toEqual(expect.any(Number))
    expect(team.name).toBe('Team A')

    const teamMember = teamMembersRepository.members.find(
      (member) => member.user_id === leaderUserId && member.team_id === team.id,
    )

    expect(teamMember).toBeTruthy()
    expect(teamMember?.user_id).toBe(leaderUserId)
    expect(teamMember?.team_id).toBe(team.id)
  })

  it('should hash team password if provided', async () => {
    const { team } = await sut.execute({
      competition_id: 1,
      name: 'Team B',
      is_private: 1,
      password: 'securepassword123',
      leader_user_id: 1,
    })

    const isPasswordCorrectlyHashed = await compare(
      'securepassword123',
      team.password_hash ?? '',
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})

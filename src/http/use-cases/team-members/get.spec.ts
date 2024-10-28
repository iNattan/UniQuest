import { describe, it, expect, beforeEach } from 'vitest'
import { GetTeamMembersByTeamIdUseCase } from './get'
import { InMemoryTeamMembersRepository } from '@/repositories/in-memory/in-memory-team-members-repository'

let teamMembersRepository: InMemoryTeamMembersRepository
let sut: GetTeamMembersByTeamIdUseCase

describe('Get Team Members By Team Id Use Case', () => {
  beforeEach(() => {
    teamMembersRepository = new InMemoryTeamMembersRepository()
    sut = new GetTeamMembersByTeamIdUseCase(teamMembersRepository)
  })

  it('should be able to get all team members by team id', async () => {
    await teamMembersRepository.create({
      user: {
        connect: { id: 1 },
      },
      team: {
        connect: { id: 1 },
      },
    })

    await teamMembersRepository.create({
      user: {
        connect: { id: 2 },
      },
      team: {
        connect: { id: 1 },
      },
    })

    const { teamMembers } = await sut.execute({ team_id: 1 })

    expect(teamMembers).toHaveLength(2)
    expect(teamMembers[0]).toHaveProperty('user_name')
    expect(teamMembers[0]).toHaveProperty('team_name')
  })

  it('should return an empty array if no members are found', async () => {
    const { teamMembers } = await sut.execute({ team_id: 999 })

    expect(teamMembers).toHaveLength(0)
  })
})

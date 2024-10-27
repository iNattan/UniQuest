import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-teams-repository'
import { InMemoryTeamMembersRepository } from '@/repositories/in-memory/in-memory-team-members-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateTeamStatusUseCase } from './update-status'
import { NotFoundError } from '../errors/not-found-error'
import { sendEmail } from '@/http/utils/sendEmail'

vi.mock('@/http/utils/sendEmail')

let teamsRepository: InMemoryTeamsRepository
let teamMembersRepository: InMemoryTeamMembersRepository
let usersRepository: InMemoryUsersRepository
let sut: UpdateTeamStatusUseCase

describe('Update Team Status Use Case', () => {
  beforeEach(() => {
    teamsRepository = new InMemoryTeamsRepository()
    teamMembersRepository = new InMemoryTeamMembersRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateTeamStatusUseCase(
      teamsRepository,
      teamMembersRepository,
      usersRepository,
    )
  })

  it('should update team status and send emails to team members', async () => {
    const createdTeam = await teamsRepository.create({
      name: 'Team C',
      is_private: 0,
      competition: { connect: { id: 1 } },
      leader: { connect: { id: 1 } },
    })

    await teamMembersRepository.create({
      team: { connect: { id: 1 } },
      user: { connect: { id: 1 } },
    })

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: '123456',
      role: 1,
    })

    const { team } = await sut.execute({
      id: createdTeam.id,
      status: 1,
    })

    expect(team.status).toBe(1)
    expect(sendEmail).toHaveBeenCalledWith({
      to: 'john.doe@example.com',
      subject: `Status da sua equipe: ${team.name}`,
      body: 'Parabéns! Sua equipe foi aprovada.',
    })
  })

  it('should not update a non-existing team', async () => {
    await expect(() =>
      sut.execute({
        id: 999,
        message: 'Non Existing Team',
        status: 0,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

import { TeamsRepository } from '@/repositories/teams-repository'
import { TeamMembersRepository } from '@/repositories/team-members-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Team } from '@prisma/client'
import { NotFoundError } from '../errors/not-found-error'
import { sendEmail } from '@/http/utils/sendEmail'

interface UpdateTeamStatusUseCaseRequest {
  id: number
  message?: string
  status: number
}

interface UpdateTeamStatusUseCaseResponse {
  team: Team
}

export class UpdateTeamStatusUseCase {
  constructor(
    private teamRepository: TeamsRepository,
    private teamMembersRepository: TeamMembersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    id,
    message,
    status,
  }: UpdateTeamStatusUseCaseRequest): Promise<UpdateTeamStatusUseCaseResponse> {
    const teamExists = await this.teamRepository.findById(id)

    if (!teamExists) {
      throw new NotFoundError('Team')
    }

    const team = await this.teamRepository.update(id, {
      message,
      status,
    })

    const teamMembers = await this.teamMembersRepository.findManyByTeamId(id)
    const membersIds = teamMembers.map((member) => member.user_id)
    const users = await Promise.all(
      membersIds.map((userId) => this.usersRepository.findById(userId)),
    )

    const emailPromises = users.map((user) =>
      sendEmail({
        to: user?.email || '',
        subject: `Status da sua equipe: ${team.name}`,
        body:
          status === 1
            ? `Parabéns! Sua equipe foi aprovada.`
            : `Infelizmente, sua equipe foi rejeitada. Motivo: ${message || 'não especificado'}`,
      }),
    )

    await Promise.all(emailPromises)

    return {
      team,
    }
  }
}

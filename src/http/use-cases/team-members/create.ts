import { TeamMembersRepository } from '@/repositories/team-members-repository'
import { TeamsRepository } from '@/repositories/teams-repository'
import { TeamMember } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { NotFoundError } from '../errors/not-found-error'

interface CreateTeamMemberUseCaseRequest {
  user_id: number
  team_id: number
  password?: string
}

interface CreateTeamMemberUseCaseResponse {
  teamMember: TeamMember
}

export class CreateTeamMemberUseCase {
  constructor(
    private teamMemberRepository: TeamMembersRepository,
    private teamsRepository: TeamsRepository,
  ) {}

  async execute({
    user_id,
    team_id,
    password,
  }: CreateTeamMemberUseCaseRequest): Promise<CreateTeamMemberUseCaseResponse> {
    const team = await this.teamsRepository.findById(team_id)

    if (!team) {
      throw new NotFoundError('Team')
    }

    if (team.is_private === 1) {
      if (!team.password_hash || !password) {
        throw new InvalidCredentialsError()
      }
      const passwordMatches = await compare(password, team.password_hash)

      if (!passwordMatches) {
        throw new InvalidCredentialsError()
      }
    }

    const teamMember = await this.teamMemberRepository.create({
      user: {
        connect: { id: user_id },
      },
      team: {
        connect: { id: team_id },
      },
    })

    return {
      teamMember,
    }
  }
}

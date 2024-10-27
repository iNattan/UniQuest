import { TeamMembersRepository } from '@/repositories/team-members-repository'
import { TeamsRepository } from '@/repositories/teams-repository'
import { TeamMember } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { NotFoundError } from '../errors/not-found-error'
import { CompetitionsRepository } from '@/repositories/competitions-repository'

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
    private competitionsRepository: CompetitionsRepository,
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

    const competition = await this.competitionsRepository.findById(
      team.competition_id,
    )

    if (!competition) {
      throw new NotFoundError('Competition')
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

    const teamMembersCount =
      await this.teamMemberRepository.countByTeamId(team_id)

    const minimumMembers = competition.min_participant

    if (teamMembersCount >= minimumMembers && team.status === null) {
      await this.teamsRepository.update(team_id, { status: 0 })
    }

    return {
      teamMember,
    }
  }
}

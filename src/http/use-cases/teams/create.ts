import { TeamMembersRepository } from '@/repositories/team-members-repository'
import { TeamsRepository } from '@/repositories/teams-repository'
import { Prisma, Team } from '@prisma/client'
import { hash } from 'bcryptjs'

interface CreateTeamUseCaseRequest {
  competition_id: number
  name: string
  is_private: number
  password?: string
  leader_user_id: number
}

interface CreateTeamUseCaseResponse {
  team: Team
}

export class CreateTeamUseCase {
  constructor(
    private teamRepository: TeamsRepository,
    private teamMemberRepository: TeamMembersRepository,
  ) {}

  async execute({
    competition_id,
    name,
    is_private,
    password,
    leader_user_id,
  }: CreateTeamUseCaseRequest): Promise<CreateTeamUseCaseResponse> {
    const teamData: Prisma.TeamCreateInput = {
      name,
      is_private,
      competition: {
        connect: { id: competition_id },
      },
      leader: {
        connect: { id: leader_user_id },
      },
    }

    if (password) {
      teamData.password_hash = await hash(password, 6)
    }

    const team = await this.teamRepository.create(teamData)

    await this.teamMemberRepository.create({
      user: {
        connect: { id: leader_user_id },
      },
      team: {
        connect: { id: team.id },
      },
    })

    return {
      team,
    }
  }
}

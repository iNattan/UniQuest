import { TeamsRepository } from '@/repositories/teams-repository'
import { Prisma, Team } from '@prisma/client'
import { hash } from 'bcryptjs'

interface CreateTeamUseCaseRequest {
  competition_id: number
  name: string
  status: number
  password?: string
  situation: number
  leader_user_id: number
}

interface CreateTeamUseCaseResponse {
  team: Team
}

export class CreateTeamUseCase {
  constructor(private teamRepository: TeamsRepository) {}

  async execute({
    competition_id,
    name,
    status,
    situation,
    password,
    leader_user_id,
  }: CreateTeamUseCaseRequest): Promise<CreateTeamUseCaseResponse> {
    const teamData: Prisma.TeamCreateInput = {
      name,
      status,
      situation,
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

    return {
      team,
    }
  }
}

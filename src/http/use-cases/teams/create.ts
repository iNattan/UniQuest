import { TeamsRepository } from '@/repositories/teams-repository'
import { Team } from '@prisma/client'

interface CreateTeamUseCaseRequest {
  competition_id: number
  name: string
  status: number
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
    leader_user_id,
  }: CreateTeamUseCaseRequest): Promise<CreateTeamUseCaseResponse> {
    const team = await this.teamRepository.create({
      name,
      status,
      situation,
      competition: {
        connect: { id: competition_id },
      },
      leader: {
        connect: { id: leader_user_id },
      },
    })

    return {
      team,
    }
  }
}

import { TeamsRepository } from '@/repositories/teams-repository'
import { Team } from '@prisma/client'

interface GetTeamUseCaseRequest {
  filter?: string
}

interface GetTeamUseCaseResponse {
  teams: Team[]
}

export class GetTeamUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute({
    filter,
  }: GetTeamUseCaseRequest): Promise<GetTeamUseCaseResponse> {
    const teams = await this.teamsRepository.findMany(filter)

    return {
      teams,
    }
  }
}

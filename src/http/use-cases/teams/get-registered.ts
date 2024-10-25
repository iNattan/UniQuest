import { TeamsRepository } from '@/repositories/teams-repository'
import { Team } from '@prisma/client'

interface GetTeamsRegisteredUseCaseRequest {
  competitionId: number
}

interface GetTeamsRegisteredUseCaseResponse {
  teams: Team[]
}

export class GetTeamsRegisteredUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute({
    competitionId,
  }: GetTeamsRegisteredUseCaseRequest): Promise<GetTeamsRegisteredUseCaseResponse> {
    const teams = await this.teamsRepository.findManyRegisteredByCompetitionId(competitionId)

    return {
      teams,
    }
  }
}

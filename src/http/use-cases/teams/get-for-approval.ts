import { TeamsRepository } from '@/repositories/teams-repository'
import { Team } from '@prisma/client'

interface GetTeamsForApprovalUseCaseRequest {
  competitionId: number
}

interface GetTeamsForApprovalUseCaseResponse {
  teams: Team[]
}

export class GetTeamsForApprovalUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute({
    competitionId,
  }: GetTeamsForApprovalUseCaseRequest): Promise<GetTeamsForApprovalUseCaseResponse> {
    const teams =
      await this.teamsRepository.findManyForApprovalByCompetitionId(
        competitionId,
      )

    return {
      teams,
    }
  }
}

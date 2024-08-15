import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { Competition } from '@prisma/client'

interface GetCompetitionUseCaseRequest {
  filter?: string
}

interface GetCompetitionUseCaseResponse {
  competitions: Competition[]
}

export class GetCompetitionUseCase {
  constructor(private competitionsRepository: CompetitionsRepository) {}

  async execute({
    filter,
  }: GetCompetitionUseCaseRequest): Promise<GetCompetitionUseCaseResponse> {
    const competitions = await this.competitionsRepository.findMany(filter)

    return {
      competitions,
    }
  }
}

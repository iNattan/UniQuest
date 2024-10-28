import { CompetitionsRepository } from '@/repositories/competitions-repository'

interface GetCompetitionRegulationUseCaseRequest {
  id: number
}

interface GetCompetitionRegulationUseCaseResponse {
  regulation: string | null
}

export class GetCompetitionRegulationUseCase {
  constructor(private competitionsRepository: CompetitionsRepository) {}

  async execute({
    id,
  }: GetCompetitionRegulationUseCaseRequest): Promise<GetCompetitionRegulationUseCaseResponse> {
    const competition = await this.competitionsRepository.findRegulationById(id)

    return {
      regulation: competition?.regulation || null,
    }
  }
}

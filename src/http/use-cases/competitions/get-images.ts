import { CompetitionsRepository } from '@/repositories/competitions-repository'

interface GetCompetitionImagesUseCaseResponse {
  competitions: Array<{
    id: number
    image: string | null
  }>
}

export class GetCompetitionImagesUseCase {
  constructor(private competitionsRepository: CompetitionsRepository) {}

  async execute(): Promise<GetCompetitionImagesUseCaseResponse> {
    const competitions = await this.competitionsRepository.findManyImages()

    return {
      competitions,
    }
  }
}

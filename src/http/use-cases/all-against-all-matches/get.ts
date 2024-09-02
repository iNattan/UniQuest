import { AllAgainstAllMatchesRepository } from '@/repositories/all-against-all-matches-repository'
import { AllAgainstAllMatch } from '@prisma/client'

interface GetAllAgainstAllMatchUseCaseRequest {
  competition_id: number
  game_id: number
}

interface GetAllAgainstAllMatchUseCaseResponse {
  allAgainstAllMatches: AllAgainstAllMatch[]
}

export class GetAllAgainstAllMatchUseCase {
  constructor(
    private allAgainstAllMatchesRepository: AllAgainstAllMatchesRepository,
  ) {}

  async execute({
    competition_id,
    game_id,
  }: GetAllAgainstAllMatchUseCaseRequest): Promise<GetAllAgainstAllMatchUseCaseResponse> {
    const allAgainstAllMatches =
      await this.allAgainstAllMatchesRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    return {
      allAgainstAllMatches,
    }
  }
}

import { DirectConfrontationMatchesRepository } from '@/repositories/direct-confrontation-matches-repository'
import { DirectConfrontationMatch } from '@prisma/client'

interface GetDirectConfrontationMatchUseCaseRequest {
  competition_id: number
  game_id: number
}

interface GetDirectConfrontationMatchUseCaseResponse {
  directConfrontationMatches: DirectConfrontationMatch[]
}

export class GetDirectConfrontationMatchUseCase {
  constructor(
    private directConfrontationMatchesRepository: DirectConfrontationMatchesRepository,
  ) {}

  async execute({
    competition_id,
    game_id,
  }: GetDirectConfrontationMatchUseCaseRequest): Promise<GetDirectConfrontationMatchUseCaseResponse> {
    const directConfrontationMatches =
      await this.directConfrontationMatchesRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    return {
      directConfrontationMatches,
    }
  }
}

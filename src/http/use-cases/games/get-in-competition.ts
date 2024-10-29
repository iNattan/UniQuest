import { CompetitionGamesRepository } from '@/repositories/competition-games-repository'

interface GetInCompetitionUseCaseRequest {
  id: number
}

interface GetInCompetitionUseCaseResponse {
  exists: boolean
}

export class GetInCompetitionUseCase {
  constructor(private competitionGamesRepository: CompetitionGamesRepository) {}

  async execute({
    id,
  }: GetInCompetitionUseCaseRequest): Promise<GetInCompetitionUseCaseResponse> {
    const games = await this.competitionGamesRepository.findByGameId(id)

    const exists = games.some((game) => new Date(game.date_game) > new Date())

    return {
      exists,
    }
  }
}

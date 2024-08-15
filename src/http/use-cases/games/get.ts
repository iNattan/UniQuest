import { GamesRepository } from '@/repositories/games-repository'
import { Game } from '@prisma/client'

interface GetGameUseCaseRequest {
  filter?: string
}

interface GetGameUseCaseResponse {
  games: Game[]
}

export class GetGameUseCase {
  constructor(private gamesRepository: GamesRepository) {}

  async execute({
    filter,
  }: GetGameUseCaseRequest): Promise<GetGameUseCaseResponse> {
    const games = await this.gamesRepository.findMany(filter)

    return {
      games,
    }
  }
}

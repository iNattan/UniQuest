import { GamesRepository } from '@/repositories/games-repository'
import { Game } from '@prisma/client'

interface GetGameByIdUseCaseRequest {
  id: number
}

interface GetGameByIdUseCaseResponse {
  game: Game | null
}

export class GetGameByIdUseCase {
  constructor(private gamesRepository: GamesRepository) {}

  async execute({
    id,
  }: GetGameByIdUseCaseRequest): Promise<GetGameByIdUseCaseResponse> {
    const game = await this.gamesRepository.findById(id)

    return {
      game,
    }
  }
}

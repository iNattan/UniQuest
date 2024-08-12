import { GamesRepository } from '@/repositories/games-repository'
import { Game } from '@prisma/client'

interface GetGameUseCaseRequest {
  filter?: string
}

interface GetGameUseCaseResponse {
  games: Game[]
}

export class GetGameUseCase {
  constructor(private userRepository: GamesRepository) {}

  async execute({
    filter,
  }: GetGameUseCaseRequest): Promise<GetGameUseCaseResponse> {
    const games = await this.userRepository.findMany(filter)

    return {
      games,
    }
  }
}

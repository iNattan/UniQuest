import { GamesRepository } from '@/repositories/games-repository'
import { Game } from '@prisma/client'

interface CreateGameUseCaseRequest {
  name: string
  min_participant: number
  max_participant: number
  first_score: number
  second_score: number
  third_score: number
  general_score: number
  category: number
}

interface CreateGameUseCaseResponse {
  game: Game
}

export class CreateGameUseCase {
  constructor(private gameRepository: GamesRepository) {}

  async execute({
    name,
    min_participant,
    max_participant,
    first_score,
    second_score,
    third_score,
    general_score,
    category,
  }: CreateGameUseCaseRequest): Promise<CreateGameUseCaseResponse> {
    const game = await this.gameRepository.create({
      name,
      min_participant,
      max_participant,
      first_score,
      second_score,
      third_score,
      general_score,
      category,
    })

    return {
      game,
    }
  }
}

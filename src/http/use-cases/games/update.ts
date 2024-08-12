import { GamesRepository } from '@/repositories/games-repository'
import { Game } from '@prisma/client'
import { NotFoundError } from '../errors/not-found-error'

interface UpdateGameUseCaseRequest {
  id: number
  name?: string
  min_participant?: number
  max_participant?: number
  first_score?: number
  second_score?: number
  third_score?: number
  general_score?: number
  category?: number
}

interface UpdateGameUseCaseResponse {
  game: Game
}

export class UpdateGameUseCase {
  constructor(private gameRepository: GamesRepository) {}

  async execute({
    id,
    name,
    min_participant,
    max_participant,
    first_score,
    second_score,
    third_score,
    general_score,
    category,
  }: UpdateGameUseCaseRequest): Promise<UpdateGameUseCaseResponse> {
    const gameExists = await this.gameRepository.findById(id)

    if (!gameExists) {
      throw new NotFoundError('Game')
    }

    const game = await this.gameRepository.update(id, {
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

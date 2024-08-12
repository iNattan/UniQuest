import { GamesRepository } from '@/repositories/games-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteGameUseCase {
  constructor(private gameRepository: GamesRepository) {}

  async execute(id: number): Promise<boolean> {
    const gameExists = await this.gameRepository.findById(id)

    if (!gameExists) {
      throw new NotFoundError('Game')
    }

    return await this.gameRepository.delete(id)
  }
}

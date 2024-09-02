import { DirectConfrontationMatchesRepository } from '@/repositories/direct-confrontation-matches-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteDirectConfrontationMatchUseCase {
  constructor(
    private directConfrontationMatchRepository: DirectConfrontationMatchesRepository,
  ) {}

  async execute(competition_id: number, game_id: number): Promise<boolean> {
    const directConfrontationMatchExists =
      await this.directConfrontationMatchRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    if (!directConfrontationMatchExists) {
      throw new NotFoundError('DirectConfrontationMatch')
    }

    return await this.directConfrontationMatchRepository.deleteMany(
      competition_id,
      game_id,
    )
  }
}

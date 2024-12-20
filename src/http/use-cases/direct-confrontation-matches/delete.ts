import { DirectConfrontationMatchesRepository } from '@/repositories/direct-confrontation-matches-repository'
import { NotFoundError } from '../errors/not-found-error'
import { ScoresRepository } from '@/repositories/scores-repository'

export class DeleteDirectConfrontationMatchUseCase {
  constructor(
    private directConfrontationMatchRepository: DirectConfrontationMatchesRepository,
    private scoresRepository: ScoresRepository,
  ) {}

  async execute(competition_id: number, game_id: number): Promise<boolean> {
    const directConfrontationMatchExists =
      await this.directConfrontationMatchRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    if (
      !directConfrontationMatchExists ||
      directConfrontationMatchExists.length === 0
    ) {
      throw new NotFoundError('DirectConfrontationMatch')
    }

    await this.scoresRepository.deleteMany(competition_id, game_id)

    return await this.directConfrontationMatchRepository.deleteMany(
      competition_id,
      game_id,
    )
  }
}

import { AllAgainstAllMatchesRepository } from '@/repositories/all-against-all-matches-repository'
import { AllAgainstAllPlacementsRepository } from '@/repositories/all-against-all-placements-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteAllAgainstAllMatchUseCase {
  constructor(
    private allAgainstAllMatchesRepository: AllAgainstAllMatchesRepository,
    private allAgainstAllPlacementsRepository: AllAgainstAllPlacementsRepository,
  ) {}

  async execute(competition_id: number, game_id: number): Promise<boolean> {
    const allAgainstAllMatchesExists =
      await this.allAgainstAllMatchesRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    if (!allAgainstAllMatchesExists) {
      throw new NotFoundError('AllAgainstAllMatch')
    }

    for (const match of allAgainstAllMatchesExists) {
      await this.allAgainstAllPlacementsRepository.deleteMany(match.id)
    }

    return await this.allAgainstAllMatchesRepository.deleteMany(
      competition_id,
      game_id,
    )
  }
}

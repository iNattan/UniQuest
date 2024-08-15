import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { NotFoundError } from '../errors/not-found-error'
import { CompetitionGamesRepository } from '@/repositories/competition-games-repository'

export class DeleteCompetitionUseCase {
  constructor(
    private competitionRepository: CompetitionsRepository,
    private competitionGamesRepository: CompetitionGamesRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    const competitionExists = await this.competitionRepository.findById(id)

    if (!competitionExists) {
      throw new NotFoundError('Competition')
    }

    const competitionGamesDeleted =
      await this.competitionGamesRepository.deleteByCompetitionId(id)
    const competitionDeleted = await this.competitionRepository.delete(id)

    return competitionGamesDeleted && competitionDeleted
  }
}

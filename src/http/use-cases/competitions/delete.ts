import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteCompetitionUseCase {
  constructor(private competitionRepository: CompetitionsRepository) {}

  async execute(id: number): Promise<boolean> {
    const competitionExists = await this.competitionRepository.findById(id)

    if (!competitionExists) {
      throw new NotFoundError('Competition')
    }

    const competitionDeleted = await this.competitionRepository.delete(id)

    return competitionDeleted
  }
}

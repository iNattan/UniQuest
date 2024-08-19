import { TeamsRepository } from '@/repositories/teams-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteTeamUseCase {
  constructor(private teamRepository: TeamsRepository) {}

  async execute(id: number): Promise<boolean> {
    const teamExists = await this.teamRepository.findById(id)

    if (!teamExists) {
      throw new NotFoundError('Team')
    }

    return await this.teamRepository.delete(id)
  }
}

import { TeamsRepository } from '@/repositories/teams-repository'
import { Team } from '@prisma/client'
import { NotFoundError } from '../errors/not-found-error'

interface UpdateTeamUseCaseRequest {
  id: number
  name?: string
  status?: number
  situation?: number
}

interface UpdateTeamUseCaseResponse {
  team: Team
}

export class UpdateTeamUseCase {
  constructor(private teamRepository: TeamsRepository) {}

  async execute({
    id,
    name,
    status,
    situation,
  }: UpdateTeamUseCaseRequest): Promise<UpdateTeamUseCaseResponse> {
    const teamExists = await this.teamRepository.findById(id)

    if (!teamExists) {
      throw new NotFoundError('Team')
    }

    const team = await this.teamRepository.update(id, {
      name,
      status,
      situation,
    })

    return {
      team,
    }
  }
}

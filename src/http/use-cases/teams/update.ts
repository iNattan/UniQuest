import { TeamsRepository } from '@/repositories/teams-repository'
import { Prisma, Team } from '@prisma/client'
import { NotFoundError } from '../errors/not-found-error'
import { hash } from 'bcryptjs'

interface UpdateTeamUseCaseRequest {
  id: number
  name?: string
  status?: number
  is_private?: number
  password?: string
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
    is_private,
    password,
  }: UpdateTeamUseCaseRequest): Promise<UpdateTeamUseCaseResponse> {
    const teamExists = await this.teamRepository.findById(id)

    if (!teamExists) {
      throw new NotFoundError('Team')
    }

    const updateData: Prisma.TeamUpdateInput = {
      name,
      status,
      is_private,
    }

    if (password) {
      updateData.password_hash = await hash(password, 6)
    }

    const team = await this.teamRepository.update(id, updateData)

    return {
      team,
    }
  }
}

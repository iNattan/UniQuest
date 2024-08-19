import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { CreateTeamUseCase } from '../create'

export function makeCreateTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const createTeamUseCase = new CreateTeamUseCase(teamsRepository)

  return createTeamUseCase
}

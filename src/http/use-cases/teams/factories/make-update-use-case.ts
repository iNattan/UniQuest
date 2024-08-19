import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { UpdateTeamUseCase } from '../update'

export function makeUpdateTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const updateTeamUseCase = new UpdateTeamUseCase(teamsRepository)

  return updateTeamUseCase
}

import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { GetTeamUseCase } from '../get'

export function makeGetTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const getTeamUseCase = new GetTeamUseCase(teamsRepository)

  return getTeamUseCase
}

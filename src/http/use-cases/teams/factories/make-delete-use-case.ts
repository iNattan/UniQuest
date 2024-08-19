import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { DeleteTeamUseCase } from '../delete'

export function makeDeleteTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const deleteTeamUseCase = new DeleteTeamUseCase(teamsRepository)

  return deleteTeamUseCase
}

import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { CreateTeamUseCase } from '../create'
import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'

export function makeCreateTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const teamMembersRepository = new PrismaTeamMembersRepository()
  
  const createTeamUseCase = new CreateTeamUseCase(teamsRepository, teamMembersRepository)

  return createTeamUseCase
}

import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'
import { CreateTeamMemberUseCase } from '../create'
import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'

export function makeCreateTeamMemberUseCase() {
  const teamMembersRepository = new PrismaTeamMembersRepository()
  const teamsRepository = new PrismaTeamsRepository()
  const competitionsRepository = new PrismaCompetitionsRepository()

  const createTeamMemberUseCase = new CreateTeamMemberUseCase(
    teamMembersRepository,
    teamsRepository,
    competitionsRepository,
  )

  return createTeamMemberUseCase
}

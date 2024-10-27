import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'
import { DeleteTeamMemberUseCase } from '../delete'
import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'

export function makeDeleteTeamMemberUseCase() {
  const teamMembersRepository = new PrismaTeamMembersRepository()
  const teamsRepository = new PrismaTeamsRepository()
  const competitionsRepository = new PrismaCompetitionsRepository()

  const deleteTeamMemberUseCase = new DeleteTeamMemberUseCase(
    teamMembersRepository,
    teamsRepository,
    competitionsRepository,
  )

  return deleteTeamMemberUseCase
}

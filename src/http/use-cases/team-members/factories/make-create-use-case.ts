import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'
import { CreateTeamMemberUseCase } from '../create'
import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'

export function makeCreateTeamMemberUseCase() {
  const teamMembersRepository = new PrismaTeamMembersRepository()
  const teamsRepository = new PrismaTeamsRepository()

  const createTeamMemberUseCase = new CreateTeamMemberUseCase(
    teamMembersRepository,
    teamsRepository,
  )

  return createTeamMemberUseCase
}

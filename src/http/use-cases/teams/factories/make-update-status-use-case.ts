import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { UpdateTeamStatusUseCase } from '../update-status'
import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeUpdateTeamStatusUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const teamMembersRepository = new PrismaTeamMembersRepository()
  const usersRepository = new PrismaUsersRepository()

  const updateTeamStatusUseCase = new UpdateTeamStatusUseCase(
    teamsRepository,
    teamMembersRepository,
    usersRepository,
  )

  return updateTeamStatusUseCase
}

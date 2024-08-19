import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'
import { DeleteTeamMemberUseCase } from '../delete'

export function makeDeleteTeamMemberUseCase() {
  const teamMembersRepository = new PrismaTeamMembersRepository()
  const deleteTeamMemberUseCase = new DeleteTeamMemberUseCase(
    teamMembersRepository,
  )

  return deleteTeamMemberUseCase
}

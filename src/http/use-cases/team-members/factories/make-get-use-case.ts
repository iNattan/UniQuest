import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'
import { GetTeamMembersByTeamIdUseCase } from '../get'

export function makeGetTeamMemberUseCase() {
  const teamMembersRepository = new PrismaTeamMembersRepository()
  const getTeamMemberUseCase = new GetTeamMembersByTeamIdUseCase(
    teamMembersRepository,
  )

  return getTeamMemberUseCase
}

import { PrismaTeamMembersRepository } from '@/repositories/prisma/prisma-team-members-repository'
import { GetUserInCompetitionUseCase } from '../get-user-in-competition'

export function makeGetUserInCompetitionUseCase() {
  const teamMembersRepository = new PrismaTeamMembersRepository()
  const getGetUserInCompetitionUseCase = new GetUserInCompetitionUseCase(
    teamMembersRepository,
  )

  return getGetUserInCompetitionUseCase
}

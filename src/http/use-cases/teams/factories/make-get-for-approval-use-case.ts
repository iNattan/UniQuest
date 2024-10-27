import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { GetTeamsForApprovalUseCase } from '../get-for-approval'

export function makeGetTeamsForApprovalUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const getTeamsForApprovalUseCase = new GetTeamsForApprovalUseCase(
    teamsRepository,
  )

  return getTeamsForApprovalUseCase
}

import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { GetTeamsRegisteredUseCase } from '../get-registered'

export function makeGetTeamsRegisteredUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const getTeamsRegisteredUseCase = new GetTeamsRegisteredUseCase(
    teamsRepository,
  )

  return getTeamsRegisteredUseCase
}

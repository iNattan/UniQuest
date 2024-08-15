import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { GetCompetitionUseCase } from '../get'

export function makeGetCompetitionUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()
  const getCompetitionUseCase = new GetCompetitionUseCase(
    competitionsRepository,
  )

  return getCompetitionUseCase
}

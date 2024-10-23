import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { GetCompetitionByIdUseCase } from '../get-by-id'

export function makeGetCompetitionByIdUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()
  const getGetCompetitionByIdUseCase = new GetCompetitionByIdUseCase(
    competitionsRepository,
  )

  return getGetCompetitionByIdUseCase
}

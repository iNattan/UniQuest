import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { DeleteCompetitionUseCase } from '../delete'

export function makeDeleteCompetitionUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()

  const deleteCompetitionUseCase = new DeleteCompetitionUseCase(
    competitionsRepository,
  )

  return deleteCompetitionUseCase
}

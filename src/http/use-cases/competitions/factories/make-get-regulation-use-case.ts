import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { GetCompetitionRegulationUseCase } from '../get-regulation'

export function makeGetCompetitionRegulationUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()
  const getCompetitionRegulationUseCase = new GetCompetitionRegulationUseCase(
    competitionsRepository,
  )

  return getCompetitionRegulationUseCase
}

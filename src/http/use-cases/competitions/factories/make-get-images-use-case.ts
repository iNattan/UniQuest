import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { GetCompetitionImagesUseCase } from '../get-images'

export function makeGetCompetitionImagesUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()
  const getCompetitionImagesUseCase = new GetCompetitionImagesUseCase(
    competitionsRepository,
  )

  return getCompetitionImagesUseCase
}

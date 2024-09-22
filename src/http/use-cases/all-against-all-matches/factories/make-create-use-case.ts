import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { PrismaAllAgainstAllPlacementsRepository } from '@/repositories/prisma/prisma-all-against-all-placements-repository'
import { PrismaScoresRepository } from '@/repositories/prisma/prisma-scores-repository'
import { CreateAllAgainstAllMatchUseCase } from '../create'

export function makeCreateAllAgainstAllMatchesUseCase() {
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const allAgainstAllPlacementsRepository =
    new PrismaAllAgainstAllPlacementsRepository()
  const scoresRepository = new PrismaScoresRepository()

  const createAllAgainstAllMatchUseCase = new CreateAllAgainstAllMatchUseCase(
    allAgainstAllMatchesRepository,
    allAgainstAllPlacementsRepository,
    scoresRepository,
  )

  return createAllAgainstAllMatchUseCase
}

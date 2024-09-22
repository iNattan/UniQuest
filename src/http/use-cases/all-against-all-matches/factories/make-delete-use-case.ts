import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { PrismaAllAgainstAllPlacementsRepository } from '@/repositories/prisma/prisma-all-against-all-placements-repository'
import { DeleteAllAgainstAllMatchUseCase } from '../delete'
import { PrismaScoresRepository } from '@/repositories/prisma/prisma-scores-repository'

export function makeDeleteAllAgainstAllMatchUseCase() {
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const allAgainstAllPlacementsRepository =
    new PrismaAllAgainstAllPlacementsRepository()
  const scoresRepository = new PrismaScoresRepository()

  const deleteAllAgainstAllMatchUseCase = new DeleteAllAgainstAllMatchUseCase(
    allAgainstAllMatchesRepository,
    allAgainstAllPlacementsRepository,
    scoresRepository,
  )

  return deleteAllAgainstAllMatchUseCase
}

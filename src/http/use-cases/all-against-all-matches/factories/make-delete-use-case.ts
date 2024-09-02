import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { PrismaAllAgainstAllPlacementsRepository } from '@/repositories/prisma/prisma-all-against-all-placements-repository'
import { DeleteAllAgainstAllMatchUseCase } from '../delete'

export function makeDeleteAllAgainstAllMatchUseCase() {
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const allAgainstAllPlacementsRepository =
    new PrismaAllAgainstAllPlacementsRepository()

  const deleteAllAgainstAllMatchUseCase = new DeleteAllAgainstAllMatchUseCase(
    allAgainstAllMatchesRepository,
    allAgainstAllPlacementsRepository,
  )

  return deleteAllAgainstAllMatchUseCase
}

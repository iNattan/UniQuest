import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { PrismaAllAgainstAllPlacementsRepository } from '@/repositories/prisma/prisma-all-against-all-placements-repository'
import { CreateAllAgainstAllMatchUseCase } from '../create'

export function makeCreateAllAgainstAllMatchesUseCase() {
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const allAgainstAllPlacementsRepository =
    new PrismaAllAgainstAllPlacementsRepository()

  const createAllAgainstAllMatchUseCase = new CreateAllAgainstAllMatchUseCase(
    allAgainstAllMatchesRepository,
    allAgainstAllPlacementsRepository,
  )

  return createAllAgainstAllMatchUseCase
}

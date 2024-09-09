import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { PrismaAllAgainstAllPlacementsRepository } from '@/repositories/prisma/prisma-all-against-all-placements-repository'
import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { CreateAllAgainstAllMatchUseCase } from '../create'

export function makeCreateAllAgainstAllMatchesUseCase() {
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const allAgainstAllPlacementsRepository =
    new PrismaAllAgainstAllPlacementsRepository()
  const gamesRepository = new PrismaGamesRepository()

  const createAllAgainstAllMatchUseCase = new CreateAllAgainstAllMatchUseCase(
    allAgainstAllMatchesRepository,
    allAgainstAllPlacementsRepository,
    gamesRepository,
  )

  return createAllAgainstAllMatchUseCase
}

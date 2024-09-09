import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { PrismaAllAgainstAllPlacementsRepository } from '@/repositories/prisma/prisma-all-against-all-placements-repository'
import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { UpdateAllAgainstAllMatchUseCase } from '../update'

export function makeUpdateAllAgainstAllMatchUseCase() {
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const allAgainstAllPlacementsRepository =
    new PrismaAllAgainstAllPlacementsRepository()
  const gamesRepository = new PrismaGamesRepository()

  const updateAllAgainstAllMatchUseCase = new UpdateAllAgainstAllMatchUseCase(
    allAgainstAllMatchesRepository,
    allAgainstAllPlacementsRepository,
    gamesRepository,
  )

  return updateAllAgainstAllMatchUseCase
}

import { PrismaScoresRepository } from '@/repositories/prisma/prisma-scores-repository'
import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { PrismaDirectConfrontationMatchesRepository } from '@/repositories/prisma/prisma-direct-confrontation-matches-repository'
import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { PrismaAllAgainstAllPlacementsRepository } from '@/repositories/prisma/prisma-all-against-all-placements-repository'
import { UpdateScoresUseCase } from '../update'

export function makeUpdateScoreUseCase() {
  const scoresRepository = new PrismaScoresRepository()
  const gamesRepository = new PrismaGamesRepository()
  const directConfrontationMatchesRepository =
    new PrismaDirectConfrontationMatchesRepository()
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const allAgainstAllPlacementsRepository =
    new PrismaAllAgainstAllPlacementsRepository()

  const updateScoresUseCase = new UpdateScoresUseCase(
    scoresRepository,
    gamesRepository,
    directConfrontationMatchesRepository,
    allAgainstAllMatchesRepository,
    allAgainstAllPlacementsRepository,
  )

  return updateScoresUseCase
}

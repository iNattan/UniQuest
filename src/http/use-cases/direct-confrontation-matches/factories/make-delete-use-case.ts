import { PrismaDirectConfrontationMatchesRepository } from '@/repositories/prisma/prisma-direct-confrontation-matches-repository'
import { DeleteDirectConfrontationMatchUseCase } from '../delete'
import { PrismaScoresRepository } from '@/repositories/prisma/prisma-scores-repository'

export function makeDeleteDirectConfrontationMatchUseCase() {
  const directConfrontationMatchsRepository =
    new PrismaDirectConfrontationMatchesRepository()
  const scoresRepository = new PrismaScoresRepository()

  const deleteDirectConfrontationMatchUseCase =
    new DeleteDirectConfrontationMatchUseCase(
      directConfrontationMatchsRepository,
      scoresRepository,
    )

  return deleteDirectConfrontationMatchUseCase
}

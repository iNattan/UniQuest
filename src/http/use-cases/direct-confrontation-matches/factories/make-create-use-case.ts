import { PrismaDirectConfrontationMatchesRepository } from '@/repositories/prisma/prisma-direct-confrontation-matches-repository'
import { CreateDirectConfrotationMatchUseCase } from '../create'
import { PrismaScoresRepository } from '@/repositories/prisma/prisma-scores-repository'

export function makeCreateDirectConfrontationMatchUseCase() {
  const directConfrontationMatchesRepository =
    new PrismaDirectConfrontationMatchesRepository()
  const scoresRepository = new PrismaScoresRepository()

  const createDirectConfrotationMatchUseCase =
    new CreateDirectConfrotationMatchUseCase(
      directConfrontationMatchesRepository,
      scoresRepository,
    )

  return createDirectConfrotationMatchUseCase
}

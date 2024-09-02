import { PrismaDirectConfrontationMatchesRepository } from '@/repositories/prisma/prisma-direct-confrontation-matches-repository'
import { UpdateDirectConfrontationMatchUseCase } from '../update'

export function makeUpdateDirectConfrontationMatchUseCase() {
  const directConfrontationMatchesRepository =
    new PrismaDirectConfrontationMatchesRepository()
  const updateDirectConfrontationMatchUseCase =
    new UpdateDirectConfrontationMatchUseCase(
      directConfrontationMatchesRepository,
    )

  return updateDirectConfrontationMatchUseCase
}

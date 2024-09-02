import { PrismaDirectConfrontationMatchesRepository } from '@/repositories/prisma/prisma-direct-confrontation-matches-repository'
import { DeleteDirectConfrontationMatchUseCase } from '../delete'

export function makeDeleteDirectConfrontationMatchUseCase() {
  const directConfrontationMatchsRepository =
    new PrismaDirectConfrontationMatchesRepository()
  const deleteDirectConfrontationMatchUseCase =
    new DeleteDirectConfrontationMatchUseCase(
      directConfrontationMatchsRepository,
    )

  return deleteDirectConfrontationMatchUseCase
}

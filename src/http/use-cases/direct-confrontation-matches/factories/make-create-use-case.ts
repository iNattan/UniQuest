import { PrismaDirectConfrontationMatchesRepository } from '@/repositories/prisma/prisma-direct-confrontation-matches-repository'
import { CreateDirectConfrotationMatchUseCase } from '../create'

export function makeCreateDirectConfrontationMatchesUseCase() {
  const directConfrontationMatchesRepository =
    new PrismaDirectConfrontationMatchesRepository()
  const createDirectConfrotationMatchUseCase =
    new CreateDirectConfrotationMatchUseCase(
      directConfrontationMatchesRepository,
    )

  return createDirectConfrotationMatchUseCase
}

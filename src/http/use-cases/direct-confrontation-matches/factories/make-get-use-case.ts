import { PrismaDirectConfrontationMatchesRepository } from '@/repositories/prisma/prisma-direct-confrontation-matches-repository'
import { GetDirectConfrontationMatchUseCase } from '../get'

export function makeGetDirectConfrontationMatchUseCase() {
  const directConfrontationMatchesRepository =
    new PrismaDirectConfrontationMatchesRepository()
  const getDirectConfrontationMatchUseCase =
    new GetDirectConfrontationMatchUseCase(directConfrontationMatchesRepository)

  return getDirectConfrontationMatchUseCase
}

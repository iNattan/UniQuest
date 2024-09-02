import { PrismaAllAgainstAllMatchesRepository } from '@/repositories/prisma/prisma-all-against-all-matches-repository'
import { GetAllAgainstAllMatchUseCase } from '../get'

export function makeGetAllAgainstAllMatchUseCase() {
  const allAgainstAllMatchesRepository =
    new PrismaAllAgainstAllMatchesRepository()
  const getAllAgainstAllMatchUseCase = new GetAllAgainstAllMatchUseCase(
    allAgainstAllMatchesRepository,
  )

  return getAllAgainstAllMatchUseCase
}

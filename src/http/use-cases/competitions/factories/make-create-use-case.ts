import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { PrismaCompetitionGamesRepository } from '@/repositories/prisma/prisma-competition-games-repository'
import { CreateCompetitionUseCase } from '../create'

export function makeCreateCompetitionUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()
  const competitionsGamesRespository = new PrismaCompetitionGamesRepository()

  const createCompetitionUseCase = new CreateCompetitionUseCase(
    competitionsRepository,
    competitionsGamesRespository,
  )

  return createCompetitionUseCase
}

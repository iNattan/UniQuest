import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { DeleteCompetitionUseCase } from '../delete'
import { PrismaCompetitionGamesRepository } from '@/repositories/prisma/prisma-competition-games-repository'

export function makeDeleteCompetitionUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()
  const competitionsGamesRespository = new PrismaCompetitionGamesRepository()

  const deleteCompetitionUseCase = new DeleteCompetitionUseCase(
    competitionsRepository,
    competitionsGamesRespository,
  )

  return deleteCompetitionUseCase
}

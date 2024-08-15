import { PrismaCompetitionsRepository } from '@/repositories/prisma/prisma-competitions-repository'
import { UpdateCompetitionUseCase } from '../update'
import { PrismaCompetitionGamesRepository } from '@/repositories/prisma/prisma-competition-games-repository'

export function makeUpdateCompetitionUseCase() {
  const competitionsRepository = new PrismaCompetitionsRepository()
  const competitionsGamesRespository = new PrismaCompetitionGamesRepository()

  const updateCompetitionUseCase = new UpdateCompetitionUseCase(
    competitionsRepository,
    competitionsGamesRespository,
  )

  return updateCompetitionUseCase
}

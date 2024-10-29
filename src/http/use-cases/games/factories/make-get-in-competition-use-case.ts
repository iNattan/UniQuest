import { PrismaCompetitionGamesRepository } from '@/repositories/prisma/prisma-competition-games-repository'
import { GetInCompetitionUseCase } from '../get-in-competition'

export function makeGetInCompetitionUseCase() {
  const competitionGamesRepository = new PrismaCompetitionGamesRepository()
  const getInCompetitionUseCase = new GetInCompetitionUseCase(
    competitionGamesRepository,
  )

  return getInCompetitionUseCase
}

import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { PrismaCompetitionGamesRepository } from '@/repositories/prisma/prisma-competition-games-repository'
import { PrismaScoresRepository } from '@/repositories/prisma/prisma-scores-repository'
import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { GetScoresUseCase } from '../get'

export function makeGetScoreUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const competitionGamesRepository = new PrismaCompetitionGamesRepository()
  const scoresRepository = new PrismaScoresRepository()
  const gamesRepository = new PrismaGamesRepository()

  const getScoresUseCase = new GetScoresUseCase(
    scoresRepository,
    teamsRepository,
    competitionGamesRepository,
    gamesRepository,
  )

  return getScoresUseCase
}

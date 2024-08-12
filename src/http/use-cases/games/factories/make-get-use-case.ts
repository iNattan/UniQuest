import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { GetGameUseCase } from '../get'

export function makeGetGameUseCase() {
  const gamesRepository = new PrismaGamesRepository()
  const getGameUseCase = new GetGameUseCase(gamesRepository)

  return getGameUseCase
}

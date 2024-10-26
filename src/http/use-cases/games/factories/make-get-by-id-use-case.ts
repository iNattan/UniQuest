import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { GetGameByIdUseCase } from '../get-by-id'

export function makeGetByIdGameUseCase() {
  const gamesRepository = new PrismaGamesRepository()
  const getGameByIdUseCase = new GetGameByIdUseCase(gamesRepository)

  return getGameByIdUseCase
}

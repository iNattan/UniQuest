import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { UpdateGameUseCase } from '../update'

export function makeUpdateGameUseCase() {
  const gamesRepository = new PrismaGamesRepository()
  const updateGameUseCase = new UpdateGameUseCase(gamesRepository)

  return updateGameUseCase
}

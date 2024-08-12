import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { CreateGameUseCase } from '../create'

export function makeCreateGameUseCase() {
  const gamesRepository = new PrismaGamesRepository()
  const createGameUseCase = new CreateGameUseCase(gamesRepository)

  return createGameUseCase
}

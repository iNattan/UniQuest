import { PrismaGamesRepository } from '@/repositories/prisma/prisma-games-repository'
import { DeleteGameUseCase } from '../delete'

export function makeDeleteGameUseCase() {
  const gamesRepository = new PrismaGamesRepository()
  const deleteGameUseCase = new DeleteGameUseCase(gamesRepository)

  return deleteGameUseCase
}

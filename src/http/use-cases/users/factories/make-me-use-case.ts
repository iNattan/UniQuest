import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { MeUserUseCase } from '../me'

export function makeMeUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const meUserUseCase = new MeUserUseCase(usersRepository)

  return meUserUseCase
}

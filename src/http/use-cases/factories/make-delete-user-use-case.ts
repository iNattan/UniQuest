import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteUserUseCase } from '../users/delete-user'

export function makeDeleteUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

  return deleteUserUseCase
}

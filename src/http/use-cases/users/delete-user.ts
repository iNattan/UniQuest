import { UsersRepository } from '@/repositories/users-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(id: number): Promise<boolean> {
    const userExists = await this.userRepository.findById(id)

    if (!userExists) {
      throw new NotFoundError('User')
    }

    return await this.userRepository.delete(id)
  }
}

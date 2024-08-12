import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

interface GetUserUseCaseRequest {
  filter?: string
}

interface GetUserUseCaseResponse {
  users: User[]
}

export class GetUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    filter,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const users = await this.userRepository.findMany(filter)

    return {
      users,
    }
  }
}

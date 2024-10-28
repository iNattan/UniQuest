import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

interface MeUserUseCaseRequest {
  email: string
}

interface MeUserUseCaseResponse {
  user: User | null
}

export class MeUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
  }: MeUserUseCaseRequest): Promise<MeUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    return {
      user,
    }
  }
}

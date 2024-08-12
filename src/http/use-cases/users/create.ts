import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { User } from '@prisma/client'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  role: number
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
      role,
    })

    return {
      user,
    }
  }
}

import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { NotFoundError } from '../errors/not-found-error'

interface UpdateUserUseCaseRequest {
  id: number
  name?: string
  email?: string
  password?: string
  role?: number
  system_deleted?: number
  system_date_deleted?: Date
}

interface UpdateUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    password,
    role,
    system_deleted,
    system_date_deleted,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const userExists = await this.userRepository.findById(id)

    if (!userExists) {
      throw new NotFoundError('User')
    }

    let password_hash: string | undefined
    if (password) {
      password_hash = await hash(password, 6)
    }

    const user = await this.userRepository.update(id, {
      name,
      email,
      password_hash,
      role,
      system_deleted,
      system_date_deleted,
    })

    return {
      user,
    }
  }
}

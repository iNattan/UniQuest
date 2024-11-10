import jwt from 'jsonwebtoken'
import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'

interface ResetPasswordUseCaseRequest {
  token: string
  newPassword: string
}

export class ResetPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<void> {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string
    }

    const user = await this.usersRepository.findByEmail(payload.email)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const passwordHash = await hash(newPassword, 6)

    await this.usersRepository.update(user.id, {
      password_hash: passwordHash,
    })
  }
}

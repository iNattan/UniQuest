import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
      role: 1,
    })

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(Number))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'nonexistent@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
      role: 1,
    })

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

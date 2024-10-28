import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { MeUserUseCase } from './me'

let userRepository: InMemoryUsersRepository
let sut: MeUserUseCase

describe('Me User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new MeUserUseCase(userRepository)
  })

  it('should be able to get user details with a valid email', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    const { user } = await sut.execute({ email: 'john.doe@example.com' })

    expect(user).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        name: 'John Doe',
        email: 'john.doe@example.com',
      }),
    )
  })

  it('should return null if no user is found with the given email', async () => {
    const { user } = await sut.execute({ email: 'non.existent@example.com' })

    expect(user).toBeNull()
  })
})

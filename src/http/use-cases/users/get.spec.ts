import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserUseCase } from './get'

let userRepository: InMemoryUsersRepository
let sut: GetUserUseCase

describe('Get User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserUseCase(userRepository)
  })

  it('should be able to get all users without filter', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    await userRepository.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    const { users } = await sut.execute({})

    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: 'John Doe' }),
      expect.objectContaining({ name: 'Jane Doe' }),
    ])
  })

  it('should be able to get users with a filter', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    await userRepository.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    await userRepository.create({
      name: 'Diego Fernandes',
      email: 'diego.fernandes@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    const { users } = await sut.execute({ filter: 'Doe' })

    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: 'John Doe' }),
      expect.objectContaining({ name: 'Jane Doe' }),
    ])
  })

  it('should return an empty array if no users match the filter', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    const { users } = await sut.execute({ filter: 'NonExistingName' })

    expect(users).toHaveLength(0)
  })
})

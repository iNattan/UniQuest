import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { DeleteUserUseCase } from './delete'
import { NotFoundError } from '../errors/not-found-error'

let userRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(userRepository)
  })

  it('should be able to delete a user', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'hashed-password',
      role: 1,
    })

    const wasDeleted = await sut.execute(createdUser.id)

    expect(wasDeleted).toBe(true)
    expect(userRepository.items.length).toBe(1)
    expect(userRepository.items[0].system_deleted).toBe(createdUser.id)
  })

  it('should not be able to delete a non-existing user', async () => {
    await expect(() => sut.execute(999)).rejects.toBeInstanceOf(NotFoundError)
  })
})

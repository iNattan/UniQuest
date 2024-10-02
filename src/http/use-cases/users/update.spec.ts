import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateUserUseCase } from './update'
import { hash, compare } from 'bcryptjs'
import { NotFoundError } from '../errors/not-found-error'

let userRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(userRepository)
  })

  it('should be able to update user details', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
      role: 1,
    })

    const { user } = await sut.execute({
      id: createdUser.id,
      name: 'John Updated',
      email: 'john.updated@example.com',
    })

    expect(user.name).toBe('John Updated')
    expect(user.email).toBe('john.updated@example.com')
  })

  it('should be able to update the user password', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
      role: 1,
    })

    const { user } = await sut.execute({
      id: createdUser.id,
      password: 'newpassword',
    })

    const isPasswordCorrectlyHashed = await compare('newpassword', user.password_hash!)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to update a non-existing user', async () => {
    await expect(() =>
      sut.execute({
        id: 999, 
        name: 'Non Existing',
        email: 'non.existing@example.com',
      })
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

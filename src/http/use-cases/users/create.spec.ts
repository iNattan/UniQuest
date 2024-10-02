import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUserUseCase } from './create'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

let userRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      role: 1,
    })

    expect(user.id).toEqual(expect.any(Number))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      role: 1,
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'john.doe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
      role: 1,
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
        role: 1,
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})

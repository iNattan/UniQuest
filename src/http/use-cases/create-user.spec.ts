import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(userRepository)
  })   

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Diego',
      email: 'diego@email.com',
      password: '12345',
      category: 0
    })

    expect(user.id).toEqual(expect.any(Number))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Diego',
      email: 'diego@email.com',
      password: '12345',
      category: 0
    })

    const isPasswordCorrectlyHashed = await compare (
      '12345',
      user.password_hash
    )
    
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'diego@email.com'

    await sut.execute({
      name: 'Diego',
      email,
      password: '12345',
      category: 0
    })
    
    await expect(() =>
      sut.execute({
        name: 'Diego',
        email,
        password: '12345',
        category: 0
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
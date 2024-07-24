import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '../use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '../use-cases/factories/make-authenticate-use-case'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const userBodySchema = z.object({
    email: z.string().email(),
    password: z.string(), 
  })

  const { email, password } = userBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    
    await authenticateUseCase.execute({
      email, 
      password,
    })    
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send(err.message) 
    }    
    
    err
  }

  return reply.status(201).send()
}
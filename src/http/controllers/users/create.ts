import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { makeCreateUserUseCase } from '../../use-cases/factories/make-create-user-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const userBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.number(),
  })

  const { name, email, password, role } = userBodySchema.parse(request.body)

  try {
    const createUserUseCase = makeCreateUserUseCase()

    await createUserUseCase.execute({
      name,
      email,
      password,
      role,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send(err.message)
    }
  }

  return reply.status(201).send()
}

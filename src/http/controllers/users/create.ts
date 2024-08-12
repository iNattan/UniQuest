import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { makeCreateUserUseCase } from '../../use-cases/users/factories/make-create-use-case'

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

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send(err.message)
    }
  }
}

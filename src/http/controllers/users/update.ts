import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserUseCase } from '../../use-cases/users/factories/make-update-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const userBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    role: z.number().optional(),
  })

  const { id } = paramsSchema.parse(request.params)

  const { name, email, password, role } = userBodySchema.parse(request.body)

  try {
    const updateUserUseCase = makeUpdateUserUseCase()

    await updateUserUseCase.execute({
      id,
      name,
      email,
      password,
      role,
    })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

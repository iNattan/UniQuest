import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserUseCase } from '../../use-cases/users/factories/make-get-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const userBodySchema = z.object({
    filter: z.string().optional(),
  })

  const { filter } = userBodySchema.parse(request.query)

  try {
    const getUserUseCase = makeGetUserUseCase()

    const users = await getUserUseCase.execute({
      filter,
    })

    return reply.status(200).send(users)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeMeUserUseCase } from '../../use-cases/users/factories/make-me-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const userBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = userBodySchema.parse(request.query)

  try {
    const meUserUseCase = makeMeUserUseCase()

    const user = await meUserUseCase.execute({
      email,
    })

    return reply.status(200).send(user)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

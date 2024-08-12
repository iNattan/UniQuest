import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetGameUseCase } from '../../use-cases/games/factories/make-get-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const gameBodySchema = z.object({
    filter: z.string().optional(),
  })

  const { filter } = gameBodySchema.parse(request.query)

  try {
    const getGameUseCase = makeGetGameUseCase()

    const games = await getGameUseCase.execute({
      filter,
    })

    return reply.status(200).send(games)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

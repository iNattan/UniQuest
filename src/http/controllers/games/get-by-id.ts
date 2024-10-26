import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetByIdGameUseCase } from '../../use-cases/games/factories/make-get-by-id-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { id } = paramsSchema.parse(request.params)

  try {
    const getGameByIdUseCase = makeGetByIdGameUseCase()

    const games = await getGameByIdUseCase.execute({
      id,
    })

    return reply.status(200).send(games)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

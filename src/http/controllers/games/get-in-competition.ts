import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetInCompetitionUseCase } from '../../use-cases/games/factories/make-get-in-competition-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function getInCompetition(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { id } = paramsSchema.parse(request.params)

  try {
    const getGameInCompetitionUseCase = makeGetInCompetitionUseCase()

    const exists = await getGameInCompetitionUseCase.execute({ id })

    return reply.status(200).send(exists)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

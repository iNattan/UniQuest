import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetScoreUseCase } from '../../use-cases/scores/factories/make-get-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    competition_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { competition_id } = paramsSchema.parse(request.params)

  try {
    const getScoreUseCase = makeGetScoreUseCase()

    const ranking = await getScoreUseCase.execute({
      competition_id,
    })

    return reply.status(200).send(ranking)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

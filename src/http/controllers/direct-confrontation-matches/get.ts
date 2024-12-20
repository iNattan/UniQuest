import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetDirectConfrontationMatchUseCase } from '../../use-cases/direct-confrontation-matches/factories/make-get-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const matchesBodySchema = z.object({
    competition_id: z.string().regex(/^\d+$/).transform(Number),
    game_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { competition_id, game_id } = matchesBodySchema.parse(request.query)

  try {
    const getDirectConfrontationMatchesUseCase =
      makeGetDirectConfrontationMatchUseCase()

    const directConfrontationMatches =
      await getDirectConfrontationMatchesUseCase.execute({
        competition_id,
        game_id,
      })

    return reply.status(200).send(directConfrontationMatches)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

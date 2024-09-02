import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteDirectConfrontationMatchUseCase } from '../../use-cases/direct-confrontation-matches/factories/make-delete-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function delete_(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    competition_id: z.string().regex(/^\d+$/).transform(Number),
    game_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { competition_id, game_id } = paramsSchema.parse(request.params)

  try {
    const deleteDirectConfrontationMatchUseCase =
      makeDeleteDirectConfrontationMatchUseCase()

    await deleteDirectConfrontationMatchUseCase.execute(competition_id, game_id)

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

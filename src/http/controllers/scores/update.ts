import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateScoreUseCase } from '../../use-cases/scores/factories/make-update-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    competition_id: z.string().regex(/^\d+$/).transform(Number),
    game_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { competition_id, game_id } = paramsSchema.parse(request.params)

  try {
    const updateScoresUseCase = makeUpdateScoreUseCase()

    const { success } = await updateScoresUseCase.execute({
      competition_id,
      game_id,
    })

    if (success) {
      return reply.status(200).send()
    } else {
      return reply.status(400).send('Failed to update scores')
    }
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    } else {
      return reply.status(500).send('Internal server error')
    }
  }
}

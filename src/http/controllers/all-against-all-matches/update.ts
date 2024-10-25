import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateAllAgainstAllMatchUseCase } from '../../use-cases/all-against-all-matches/factories/make-update-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'
import { makeUpdateScoreUseCase } from '../../use-cases/scores/factories/make-update-use-case'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    match_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const placementsBodySchema = z.object({
    competition_id: z.number(),
    game_id: z.number(),
    placements: z.array(
      z.object({
        team_id: z.number(),
        position: z.number(),
      }),
    ),
  })

  const { match_id } = paramsSchema.parse(request.params)
  const { competition_id, game_id, placements } = placementsBodySchema.parse(
    request.body,
  )

  try {
    const updateAllAgainstAllMatchUseCase =
      makeUpdateAllAgainstAllMatchUseCase()

    await updateAllAgainstAllMatchUseCase.execute({
      match_id,
      placements,
    })

    const updateScoresUseCase = makeUpdateScoreUseCase()

    const { success } = await updateScoresUseCase.execute({
      competition_id,
      game_id,
    })

    if (!success) {
      return reply.status(400).send('Failed to update scores')
    }

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }

    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}

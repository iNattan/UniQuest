import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateDirectConfrontationMatchUseCase } from '../../use-cases/direct-confrontation-matches/factories/make-update-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const matchesBodySchema = z.object({
    winner_team_id: z.number(),
  })

  const { id } = paramsSchema.parse(request.params)

  const { winner_team_id } = matchesBodySchema.parse(request.body)

  try {
    const updateDirectConfrontationMatchUseCase =
      makeUpdateDirectConfrontationMatchUseCase()

    await updateDirectConfrontationMatchUseCase.execute({
      id,
      winner_team_id,
    })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateDirectConfrontationMatchUseCase } from '../../use-cases/direct-confrontation-matches/factories/make-create-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const matchesBodySchema = z.object({
    competition_id: z.number(),
    game_id: z.number(),
    teams: z.array(z.number()),
  })

  const { competition_id, game_id, teams } = matchesBodySchema.parse(
    request.body,
  )

  const createMatchUseCase = makeCreateDirectConfrontationMatchUseCase()

  await createMatchUseCase.execute({
    competition_id,
    game_id,
    teams,
  })

  return reply.status(201).send()
}

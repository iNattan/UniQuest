import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateAllAgainstAllMatchesUseCase } from '../../use-cases/all-against-all-matches/factories/make-create-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const matchesBodySchema = z.object({
    competition_id: z.number(),
    game_id: z.number(),
    number_of_rounds: z.number(),
    teams: z.array(z.number()),
  })

  const { competition_id, game_id, number_of_rounds, teams } =
    matchesBodySchema.parse(request.body)

  const createMatchesUseCase = makeCreateAllAgainstAllMatchesUseCase()

  await createMatchesUseCase.execute({
    competition_id,
    game_id,
    number_of_rounds,
    teams,
  })

  return reply.status(201).send()
}

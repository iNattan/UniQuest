import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGameUseCase } from '../../use-cases/games/factories/make-create-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const gameBodySchema = z.object({
    name: z.string(),
    min_participant: z.number(),
    max_participant: z.number(),
    first_score: z.number(),
    second_score: z.number(),
    third_score: z.number(),
    general_score: z.number(),
    category: z.number(),
  })

  const {
    name,
    min_participant,
    max_participant,
    first_score,
    second_score,
    third_score,
    general_score,
    category,
  } = gameBodySchema.parse(request.body)

  const createGameUseCase = makeCreateGameUseCase()

  await createGameUseCase.execute({
    name,
    min_participant,
    max_participant,
    first_score,
    second_score,
    third_score,
    general_score,
    category,
  })

  return reply.status(201).send()
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateGameUseCase } from '../../use-cases/games/factories/make-update-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const gameBodySchema = z.object({
    name: z.string().optional(),
    min_participant: z.number().optional(),
    max_participant: z.number().optional(),
    first_score: z.number().optional(),
    second_score: z.number().optional(),
    third_score: z.number().optional(),
    general_score: z.number().optional(),
    category: z.number().optional(),
  })

  const { id } = paramsSchema.parse(request.params)

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

  try {
    const updateGameUseCase = makeUpdateGameUseCase()

    await updateGameUseCase.execute({
      id,
      name,
      min_participant,
      max_participant,
      first_score,
      second_score,
      third_score,
      general_score,
      category,
    })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

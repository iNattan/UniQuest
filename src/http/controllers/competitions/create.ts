import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateCompetitionUseCase } from '../../use-cases/competitions/factories/make-create-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const competitionBodySchema = z.object({
    title: z.string(),
    date_event: z.coerce.date(),
    start_registration: z.coerce.date(),
    end_registration: z.coerce.date(),
    min_participant: z.number(),
    max_participant: z.number(),
    local: z.string(),
    description: z.string().optional(),
    games: z
      .array(
        z.object({
          local: z.string(),
          date_game: z.coerce.date(),
          game_id: z.number(),
        }),
      )
      .optional(),
  })

  const {
    title,
    date_event,
    start_registration,
    end_registration,
    min_participant,
    max_participant,
    local,
    description,
    games,
  } = competitionBodySchema.parse(request.body)

  const createCompetitionUseCase = makeCreateCompetitionUseCase()

  await createCompetitionUseCase.execute({
    title,
    date_event,
    start_registration,
    end_registration,
    min_participant,
    max_participant,
    local,
    description,
    games,
  })

  return reply.status(201).send()
}

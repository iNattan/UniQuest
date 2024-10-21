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
    CompetitionGames: z
      .array(
        z.object({
          local: z.string(),
          date_game: z.coerce.date(),
          game_id: z.number(),
        }),
      )
      .optional(),
    image: z.string().optional(),
    image_name: z.string().optional(),
    regulation: z.string().optional(),
    regulation_name: z.string().optional(),
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
    CompetitionGames,
    image,
    image_name,
    regulation,    
    regulation_name,
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
    CompetitionGames,
    image,
    image_name,
    regulation,
    regulation_name,
  })

  return reply.status(201).send()
}

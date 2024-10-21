import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCompetitionUseCase } from '../../use-cases/competitions/factories/make-update-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const competitionBodySchema = z.object({
    title: z.string().optional(),
    date_event: z.coerce.date().optional(),
    start_registration: z.coerce.date().optional(),
    end_registration: z.coerce.date().optional(),
    min_participant: z.number().optional(),
    max_participant: z.number().optional(),
    local: z.string().optional(),
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

  const { id } = paramsSchema.parse(request.params)

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

  try {
    const updateCompetitionUseCase = makeUpdateCompetitionUseCase()

    await updateCompetitionUseCase.execute({
      id,
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

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

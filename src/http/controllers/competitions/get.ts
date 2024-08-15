import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetCompetitionUseCase } from '../../use-cases/competitions/factories/make-get-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const competitionBodySchema = z.object({
    filter: z.string().optional(),
  })

  const { filter } = competitionBodySchema.parse(request.query)

  try {
    const getCompetitionUseCase = makeGetCompetitionUseCase()

    const competitions = await getCompetitionUseCase.execute({
      filter,
    })

    return reply.status(200).send(competitions)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

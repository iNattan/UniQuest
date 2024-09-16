import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetTeamUseCase } from '../../use-cases/teams/factories/make-get-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const teamBodySchema = z.object({
    filter: z.string().optional(),
  })

  const { filter } = teamBodySchema.parse(request.query)

  try {
    const getTeamUseCase = makeGetTeamUseCase()

    const teams = await getTeamUseCase.execute({
      filter,
    })

    return reply.status(200).send(teams)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}
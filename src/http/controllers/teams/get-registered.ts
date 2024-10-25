import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'
import { makeGetTeamsRegisteredUseCase } from '@/http/use-cases/teams/factories/make-get-registered-use-case'

export async function getRegistered(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    competitionId: z.string().regex(/^\d+$/).transform(Number),
  })

  const { competitionId } = paramsSchema.parse(request.params)

  try {
    const getTeamsRegisteredUseCase = makeGetTeamsRegisteredUseCase()

    const teams = await getTeamsRegisteredUseCase.execute({
      competitionId,
    })

    return reply.status(200).send(teams)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

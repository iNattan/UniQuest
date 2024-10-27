import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateTeamStatusUseCase } from '../../use-cases/teams/factories/make-update-status-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function updateStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const teamBodySchema = z.object({
    status: z.number(),
    message: z.string().optional(),
  })

  const { id } = paramsSchema.parse(request.params)

  const { status, message } = teamBodySchema.parse(request.body)

  try {
    const updateTeamStatusUseCase = makeUpdateTeamStatusUseCase()

    await updateTeamStatusUseCase.execute({
      id,
      status,
      message,
    })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

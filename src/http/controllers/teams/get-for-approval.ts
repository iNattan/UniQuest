import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'
import { makeGetTeamsForApprovalUseCase } from '@/http/use-cases/teams/factories/make-get-for-approval-use-case'

export async function getForApproval(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    competitionId: z.string().regex(/^\d+$/).transform(Number),
  })

  const { competitionId } = paramsSchema.parse(request.params)

  try {
    const getTeamsForApprovalUseCase = makeGetTeamsForApprovalUseCase()

    const teams = await getTeamsForApprovalUseCase.execute({
      competitionId,
    })

    return reply.status(200).send(teams)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserInCompetitionUseCase } from '../../use-cases/team-members/factories/make-get-user-in-competition-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function getUserInCompetition(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    competition_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { competition_id } = paramsSchema.parse(request.params)
  const user_id = parseInt(request.user.sub, 10)

  try {
    const getTeamMemberUseCase = makeGetUserInCompetitionUseCase()

    const teamMembers = await getTeamMemberUseCase.execute({
      user_id,
      competition_id,
    })

    return reply.status(200).send(teamMembers)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

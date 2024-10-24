import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetTeamMemberUseCase } from '../../use-cases/team-members/factories/make-get-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    team_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { team_id } = paramsSchema.parse(request.params)

  try {
    const getTeamMemberUseCase = makeGetTeamMemberUseCase()

    const teamMembers = await getTeamMemberUseCase.execute({
      team_id,
    })

    return reply.status(200).send(teamMembers)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteTeamMemberUseCase } from '../../use-cases/team-members/factories/make-delete-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function delete_(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    team_id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { team_id } = paramsSchema.parse(request.params)

  const user_id = parseInt(request.user.sub, 10)

  try {
    const deleteTeamMemberUseCase = makeDeleteTeamMemberUseCase()

    await deleteTeamMemberUseCase.execute(user_id, team_id)

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateTeamMemberUseCase } from '../../use-cases/team-members/factories/make-create-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const teamMemberBodySchema = z.object({
    team_id: z.number(),
    password: z.string().optional(),
  })

  const { team_id, password } = teamMemberBodySchema.parse(request.body)

  const user_id = parseInt(request.user.sub, 10)

  const createTeamMemberUseCase = makeCreateTeamMemberUseCase()

  await createTeamMemberUseCase.execute({
    user_id,
    team_id,
    password,
  })

  return reply.status(201).send()
}

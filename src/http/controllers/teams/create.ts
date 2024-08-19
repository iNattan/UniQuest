import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateTeamUseCase } from '../../use-cases/teams/factories/make-create-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const teamBodySchema = z.object({
    competition_id: z.number(),
    name: z.string(),
    status: z.number(),
    situation: z.number(),
  })

  const { competition_id, name, status, situation } = teamBodySchema.parse(
    request.body,
  )

  const leader_user_id = parseInt(request.user.sub, 10)

  const createTeamUseCase = makeCreateTeamUseCase()

  await createTeamUseCase.execute({
    competition_id,
    name,
    status,
    situation,
    leader_user_id,
  })

  return reply.status(201).send()
}

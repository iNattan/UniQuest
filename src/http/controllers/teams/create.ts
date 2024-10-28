import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateTeamUseCase } from '../../use-cases/teams/factories/make-create-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const teamBodySchema = z.object({
    competition_id: z.number(),
    name: z.string(),
    is_private: z.number(),
    password: z.string().optional(),
  })

  const { competition_id, name, is_private, password } = teamBodySchema.parse(
    request.body,
  )

  const leader_user_id = parseInt(request.user.sub, 10)

  const createTeamUseCase = makeCreateTeamUseCase()

  await createTeamUseCase.execute({
    competition_id,
    name,
    is_private,
    password,
    leader_user_id,
  })

  return reply.status(201).send()
}

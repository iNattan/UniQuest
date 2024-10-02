import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateTeamUseCase } from '../../use-cases/teams/factories/make-update-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const teamBodySchema = z.object({
    name: z.string().optional(),
    status: z.number().optional(),
    is_private: z.number().optional(),
    password: z.string().optional(),
  })

  const { id } = paramsSchema.parse(request.params)

  const { name, status, is_private, password } = teamBodySchema.parse(
    request.body,
  )

  try {
    const updateTeamUseCase = makeUpdateTeamUseCase()

    await updateTeamUseCase.execute({
      id,
      name,
      status,
      is_private,
      password,
    })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

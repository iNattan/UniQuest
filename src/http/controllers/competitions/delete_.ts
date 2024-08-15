import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteCompetitionUseCase } from '../../use-cases/competitions/factories/make-delete-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function delete_(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { id } = paramsSchema.parse(request.params)

  try {
    const deleteCompetitionUseCase = makeDeleteCompetitionUseCase()

    await deleteCompetitionUseCase.execute(id)

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

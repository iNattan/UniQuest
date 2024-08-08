import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteUserUseCase } from '../../use-cases/factories/make-delete-user-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function delete_(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })

  const { id } = paramsSchema.parse(request.params)

  try {
    const deleteUserUseCase = makeDeleteUserUseCase()

    await deleteUserUseCase.execute(id)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }

  return reply.status(200).send()
}

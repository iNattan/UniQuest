import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'
import { makeGetCompetitionByIdUseCase } from '@/http/use-cases/competitions/factories/make-get-by-id-use-case'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const competitionParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = competitionParamsSchema.parse(request.params)

  try {
    const getCompetitionRegulationUseCase = makeGetCompetitionByIdUseCase()

    const { competition } = await getCompetitionRegulationUseCase.execute({
      id: Number(id),
    })

    return reply.status(200).send({ competition })
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

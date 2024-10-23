import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetCompetitionRegulationUseCase } from '../../use-cases/competitions/factories/make-get-regulation-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function getRegulation(request: FastifyRequest, reply: FastifyReply) {
  const competitionParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = competitionParamsSchema.parse(request.params)

  try {
    const getCompetitionRegulationUseCase = makeGetCompetitionRegulationUseCase()

    const { regulation } = await getCompetitionRegulationUseCase.execute({
      id: Number(id),
    })

    return reply.status(200).send({ regulation })
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetCompetitionImagesUseCase } from '../../use-cases/competitions/factories/make-get-images-use-case'
import { NotFoundError } from '@/http/use-cases/errors/not-found-error'

export async function getImages(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getCompetitionImagesUseCase = makeGetCompetitionImagesUseCase()

    const competitions = await getCompetitionImagesUseCase.execute()

    return reply.status(200).send(competitions)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.status(404).send(err.message)
    }
  }
}

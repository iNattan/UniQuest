import { FastifyInstance } from 'fastify'
import { create } from './create'
import { get } from './get'
import { getRegistered } from './get-registered'
import { update } from './update'
import { delete_ } from './delete_'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function teamsRoutes(app: FastifyInstance) {
  app.post('/teams', { onRequest: [verifyJWT] }, create)

  app.put('/teams/:id', update)

  app.delete('/teams/:id', delete_)

  app.get('/:competitionId/teams', get)
  app.get('/:competitionId/teams-registered', getRegistered)
}

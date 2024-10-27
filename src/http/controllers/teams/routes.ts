import { FastifyInstance } from 'fastify'
import { create } from './create'
import { get } from './get'
import { getRegistered } from './get-registered'
import { delete_ } from './delete_'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { getForApproval } from './get-for-approval'
import { updateStatus } from './update-status'

export async function teamsRoutes(app: FastifyInstance) {
  app.post('/teams', { onRequest: [verifyJWT] }, create)

  app.patch('/teams/:id/status', updateStatus)

  app.delete('/teams/:id', delete_)

  app.get('/:competitionId/teams', get)
  app.get('/:competitionId/teams-for-approval', getForApproval)
  app.get('/:competitionId/teams-registered', getRegistered)
}

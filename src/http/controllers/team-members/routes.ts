import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { delete_ } from './delete_'

export async function teamMembersRoutes(app: FastifyInstance) {
  app.post('/teamMembers', { onRequest: [verifyJWT] }, create)

  app.delete('/teamMembers/:team_id', { onRequest: [verifyJWT] }, delete_)
}

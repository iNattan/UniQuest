import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { delete_ } from './delete_'
import { get } from './get'
import { getUserInCompetition } from './get-user-in-competition'

export async function teamMembersRoutes(app: FastifyInstance) {
  app.post('/teamMembers', { onRequest: [verifyJWT] }, create)

  app.delete('/teamMembers/:team_id', { onRequest: [verifyJWT] }, delete_)

  app.get('/teamMembers/:team_id', { onRequest: [verifyJWT] }, get)
  app.get('/teamMembers/me/:competition_id', { onRequest: [verifyJWT] }, getUserInCompetition)
}

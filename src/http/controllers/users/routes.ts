import { FastifyInstance } from 'fastify'
import { create } from './create'
import { authenticate } from './authenticate'
import { get } from './get'
import { refresh } from './refresh'
import { update } from './update'
import { delete_ } from './delete_'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', create)
  app.post('/sessions', authenticate)

  app.put('/users/:id', update)

  app.patch('/token/refresh', refresh)

  app.delete('/users/:id', delete_)

  app.get('/users', { onRequest: verifyJWT }, get)
}

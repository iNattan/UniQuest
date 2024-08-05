import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/create-user'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'
import { refresh } from './controllers/refresh'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/profile', { onRequest: [verifyJWT] }, profile)
}

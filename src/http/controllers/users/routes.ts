import { FastifyInstance } from 'fastify'
import { create } from './create'
import { authenticate } from './authenticate'
import { get } from './get'
import { refresh } from './refresh'
import { update } from './update'
import { delete_ } from './delete_'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { me } from './me'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { logout } from './logout'
import { requestPasswordReset } from './request-password-reset'
import { resetPassword } from './reset-password'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', create)
  app.post('/sessions', authenticate)

  app.post('/forgot-password', requestPasswordReset)

  app.post('/reset-password', resetPassword)

  app.put('/users/:id', { onRequest: [verifyJWT, verifyUserRole(1)] }, update)

  app.patch('/token/refresh', refresh)

  app.delete(
    '/users/:id',
    { onRequest: [verifyJWT, verifyUserRole(1)] },
    delete_,
  )

  app.get('/users', { onRequest: [verifyJWT, verifyUserRole(1)] }, get)
  app.get('/users/me', { onRequest: verifyJWT }, me)

  app.post('/logout', { onRequest: verifyJWT }, logout)
}

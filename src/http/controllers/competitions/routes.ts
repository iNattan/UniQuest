import { FastifyInstance } from 'fastify'
import { create } from './create'
import { get } from './get'
import { update } from './update'
import { delete_ } from './delete_'

export async function competitionsRoutes(app: FastifyInstance) {
  app.post('/competitions', create)

  app.put('/competitions/:id', update)

  app.delete('/competitions/:id', delete_)

  app.get('/competitions', get)
}

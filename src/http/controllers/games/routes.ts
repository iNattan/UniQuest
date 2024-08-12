import { FastifyInstance } from 'fastify'
import { create } from './create'
import { get } from './get'
import { update } from './update'
import { delete_ } from './delete_'

export async function gamesRoutes(app: FastifyInstance) {
  app.post('/games', create)

  app.put('/games/:id', update)

  app.delete('/games/:id', delete_)

  app.get('/games', get)
}

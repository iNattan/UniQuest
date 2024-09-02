import { FastifyInstance } from 'fastify'
import { create } from './create'
import { get } from './get'
import { update } from './update'
import { delete_ } from './delete_'

export async function directConfrontationMatchesRoutes(app: FastifyInstance) {
  app.post('/matches/direct', create)

  app.patch('/matches/direct/:id', update)

  app.delete('/matches/direct/:competition_id/:game_id', delete_)

  app.get('/matches/direct', get)
}

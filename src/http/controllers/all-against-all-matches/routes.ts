import { FastifyInstance } from 'fastify'
import { create } from './create'
import { get } from './get'
// import { update } from './update'
import { delete_ } from './delete_'

export async function allAgainstAllMatchesRoutes(app: FastifyInstance) {
  app.post('/matches/all', create)

  // app.patch('/matches/all/:id', update)

  app.delete('/matches/all/:competition_id/:game_id', delete_)

  app.get('/matches/all', get)
}

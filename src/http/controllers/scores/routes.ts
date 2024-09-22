import { FastifyInstance } from 'fastify'
import { update } from './update'
import { get } from './get'

export async function scoresRoutes(app: FastifyInstance) {
  app.patch('/scores/:competition_id/:game_id', update)

  app.get('/scores/:competition_id', get)
}

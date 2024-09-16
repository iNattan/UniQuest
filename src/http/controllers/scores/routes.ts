import { FastifyInstance } from 'fastify'
import { update } from './update'

export async function scoresRoutes(app: FastifyInstance) {
  app.put('/scores/:competition_id/:game_id', update)
}

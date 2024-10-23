import { FastifyInstance } from 'fastify'
import { create } from './create'
import { get } from './get'
import { update } from './update'
import { delete_ } from './delete_'
import { getImages } from './get-images'
import { getRegulation } from './get-regulation'

export async function competitionsRoutes(app: FastifyInstance) {
  app.post('/competitions', create)

  app.put('/competitions/:id', update)

  app.delete('/competitions/:id', delete_)

  app.get('/competitions', get)
  app.get('/competitions/images', getImages)
  app.get('/competitions/regulation/:id', getRegulation)
}

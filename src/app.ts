import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { usersRoutes } from './http/controllers/users/routes'
import { gamesRoutes } from './http/controllers/games/routes'
import { competitionsRoutes } from './http/controllers/competitions/routes'
import { teamsRoutes } from './http/controllers/teams/routes'
import { teamMembersRoutes } from './http/controllers/team-members/routes'
import { directConfrontationMatchesRoutes } from './http/controllers/direct-confrontation-matches/routes'
import { allAgainstAllMatchesRoutes } from './http/controllers/all-against-all-matches/routes'
import { scoresRoutes } from './http/controllers/scores/routes'
import cors from '@fastify/cors'

export const app = fastify({
  bodyLimit: 10485760,
})

app.register(cors, {
  origin: [
    'http://localhost:3000',
    'https://uniquest-production.up.railway.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gamesRoutes)
app.register(competitionsRoutes)
app.register(teamsRoutes)
app.register(teamMembersRoutes)
app.register(directConfrontationMatchesRoutes)
app.register(allAgainstAllMatchesRoutes)
app.register(scoresRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internar server error.' })
})

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '../use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '../use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = userBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role.toString(),
      },
      {
        sign: {
          sub: user.id.toString(),
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role.toString(),
      },
      {
        sign: {
          sub: user.id.toString(),
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send(err.message)
    }

    throw err
  }
}

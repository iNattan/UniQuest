import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role, name, sub } = request.user

  const token = await reply.jwtSign(
    { role, name },
    {
      sign: {
        sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role, name },
    {
      sign: {
        sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}

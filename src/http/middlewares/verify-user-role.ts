import { FastifyRequest, FastifyReply } from 'fastify'

export function verifyUserRole(roleToVerify: 0 | 1) {
  return (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}

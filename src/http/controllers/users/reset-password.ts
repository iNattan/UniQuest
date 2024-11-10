import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeResetPasswordUseCase } from '../../use-cases/users/factories/make-reset-password-use-case'

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string(),
  })

  const { token, newPassword } = resetPasswordSchema.parse(request.body)

  try {
    const resetPasswordUseCase = makeResetPasswordUseCase()
    await resetPasswordUseCase.execute({ token, newPassword })

    return reply.status(200).send({
      message: 'Senha redefinida com sucesso',
    })
  } catch (error) {
    return reply.status(400).send('Token inválido ou expirado')
  }
}

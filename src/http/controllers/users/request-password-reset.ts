import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../utils/sendEmail'

export async function requestPasswordReset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestPasswordResetSchema = z.object({
    email: z.string().email(),
  })

  const { email } = requestPasswordResetSchema.parse(request.body)

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: '15m',
  })

  const baseUrl = process.env.BASE_URL
  const resetLink = `${baseUrl}/redefinir-senha?token=${resetToken}`
  const emailBody = `Você solicitou a redefinição de senha.\nClique no link para redefinir sua senha: ${resetLink}\n\nSe você não solicitou esta ação, ignore este e-mail.`

  await sendEmail({
    to: email,
    subject: 'Redefinição de Senha',
    body: emailBody,
  })

  return reply.status(200).send({
    message:
      'Se o e-mail estiver registrado, um link de redefinição será enviado.',
  })
}

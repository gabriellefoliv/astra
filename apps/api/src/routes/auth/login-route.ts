import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { login } from '../../functions/auth/login'

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/login',
    {
      schema: {
        summary: 'Login do usuário',
        tags: ['auth'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { token } = await login(app, { email, password })

      reply.send({ token })
    }
  )
}

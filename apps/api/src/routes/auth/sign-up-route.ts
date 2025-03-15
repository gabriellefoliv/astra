import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { signUp } from '../../functions/auth/sign-up'

export const signUpRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/user',
    {
      schema: {
        summary: 'Create a new user',
        tags: ['users'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            userId: z.string(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { name, email, password } = request.body

        const { userId } = await signUp({ name, email, password })

        return reply.status(201).send({ userId })
      } catch (error) {
        if (error instanceof Error && error.message === 'User already exists') {
          return reply.status(409).send({ error: error.message })
        }
        return reply.status(500).send({ error: 'Internal server error' })
      }
    }
  )
}

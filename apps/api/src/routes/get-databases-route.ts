import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getDatabases } from '../functions/get-databases'

export const getDatabasesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/database',
    {
      schema: {
        summary: 'Get all databases for authenticated user',
        tags: ['databases'],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              data: z.string(),
              userId: z.string(),
            })
          ),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      const { databases } = await getDatabases({ userId })

      reply.status(200).send(databases)
    }
  )
}

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
              path: z.string(),
              createdAt: z.date(),
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

      try {
        const databases = await getDatabases({ userId })
        reply.status(200).send(databases)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        console.error('Failed to fetch databases:', error)
        reply.status(500).send({ error: 'Failed to fetch databases' })
      }
    }
  )
}

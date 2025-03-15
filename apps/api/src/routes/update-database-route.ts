import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { updateDatabase } from '../functions/update-database'

export const updateDatabaseRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/database/:id',
    {
      schema: {
        summary: 'Update a database for authenticated user',
        tags: ['databases'],
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string(),
          data: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            data: z.string(),
            userId: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
          403: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { name, data } = request.body
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      try {
        const database = await updateDatabase({ userId, id, name, data })
        reply.status(200).send(database)
      } catch (error) {
        reply.status(403).send({ error: 'Database not found or unauthorized' })
      }
    }
  )
}

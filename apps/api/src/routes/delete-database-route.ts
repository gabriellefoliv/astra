import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteDatabase } from '../functions/delete-database'

export const deleteDatabaseRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/api/database/:id',
    {
      schema: {
        summary: 'Delete a user database',
        tags: ['databases'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
          }),
          401: z.object({ error: z.string() }),
          403: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      try {
        const result = await deleteDatabase({ userId, databaseId: id })
        return reply.status(200).send(result)
      } catch (error) {
        return reply.status(403).send({ error: 'Failed to delete database' })
      }
    }
  )
}

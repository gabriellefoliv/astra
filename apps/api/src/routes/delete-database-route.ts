import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteDatabase } from '../functions/delete-database'

export const deleteDatabaseRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/api/database/:id',
    {
      schema: {
        summary: 'Delete a database for authenticated user',
        tags: ['databases'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
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
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      try {
        await deleteDatabase({ userId, id })
        reply.status(200).send({ message: 'Database deleted successfully' })
      } catch (error) {
        reply.status(403).send({ error: 'Database not found or unauthorized' })
      }
    }
  )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createDatabase } from '../functions/create-database'

export const createDatabaseRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/database',
    {
      schema: {
        summary: 'Create a new database',
        tags: ['databases'],
        body: z.object({
          name: z.string(),
          data: z.string(),
        }),
        response: {
          201: z.object({
            databaseId: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, data } = request.body
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      const { databaseId } = await createDatabase({
        name,
        data,
        userId,
      })

      reply.status(201).send({
        databaseId,
      })
    }
  )
}

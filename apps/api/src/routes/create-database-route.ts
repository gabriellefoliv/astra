import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createDatabase } from '../functions/create-database'

export const createDatabaseRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/database',
    {
      schema: {
        summary: 'Create a new database for the authenticated user',
        tags: ['databases'],
        body: z.object({
          name: z.string().min(1).max(20),
        }),
        response: {
          201: z.object({
            databaseId: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      try {
        const { databaseId } = await createDatabase({ name, userId })

        reply.status(201).send({
          databaseId,
        })
      } catch (error) {
        reply.status(400).send({
          error:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
        })
      }
    }
  )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { executeQuery } from '../functions/execute-query'

export const executeQueryRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/database/:id/query',
    {
      schema: {
        summary: 'Execute SQL query on user database',
        tags: ['databases'],
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          query: z.string(),
        }),
        response: {
          200: z.union([
            z.object({
              rows: z.array(z.record(z.any())),
            }),
            z.object({
              success: z.literal(true),
              result: z.unknown(),
            }),
          ]),
          401: z.object({ error: z.string() }),
          403: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { query } = request.body
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      try {
        const result = await executeQuery({
          userId,
          databaseId: id,
          query,
        })

        if ('rows' in result) {
          reply.status(200).send({ rows: result.rows ?? [] })
        } else {
          reply.status(200).send({ success: true, result: result.result })
        }
      } catch (error) {
        console.error('Query execution error:', error)
        reply.status(403).send({ error: 'Invalid query or database' })
      }
    }
  )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getProjectsByUser } from '../../functions/projects/get-projects-by-user'

export const getProjectsByUserRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/projects',
    {
      schema: {
        summary: 'List all projects by user',
        tags: ['projects'],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
              createdAt: z.date(),
              role: z.enum(['OWNER', 'EDITOR', 'VIEWER']),
              databases: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  path: z.string(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                })
              ),
            })
          ),
          400: z.object({
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
        const projects = await getProjectsByUser({ userId })

        return reply.status(200).send(projects)
      } catch (error) {
        return reply.status(400).send({ error: 'An unknown error occurred' })
      }
    }
  )
}

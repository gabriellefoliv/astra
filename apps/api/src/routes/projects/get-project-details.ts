import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getProjectDetails } from '../../functions/projects/get-project-details'

export const getProjectDetailsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/projects/:id',
    {
      schema: {
        summary: 'Get project details for authenticated user',
        tags: ['projects'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
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
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.userId

      const { id: projectId } = request.params

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }

      try {
        const project = await getProjectDetails({ userId, projectId })

        if (!project) {
          return reply.status(404).send({ error: 'Project not found' })
        }

        return reply.status(200).send(project)
      } catch (error) {
        return reply.status(400).send({ error: 'An unknown error occurred' })
      }
    }
  )
}

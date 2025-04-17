import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createProject } from '../../functions/projects/create-project'

export const createProjectRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/projects',
    {
      schema: {
        summary: 'Create a new project for the authenticated user',
        tags: ['projects'],
        body: z.object({
          name: z.string().min(1).max(20),
        }),
        response: {
          201: z.object({
            projectId: z.string(),
          }),
          400: z.object({
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
        const newProject = await createProject({ name, userId })

        return reply.status(201).send({
          projectId: newProject.id,
        })
      } catch (error) {
        return reply.status(400).send({ error: 'An unknown error occurred' })
      }
    }
  )
}

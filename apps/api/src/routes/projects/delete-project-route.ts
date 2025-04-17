import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteProject } from '../../functions/projects/delete-project'

export const deleteProjectRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/api/projects/:id',
    {
      schema: {
        summary: 'Delete a project if user is owner',
        tags: ['projects'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
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
        await deleteProject({ projectId: id, userId })

        return reply
          .status(200)
          .send({ message: 'Project deleted successfully' })
      } catch (error) {
        console.error('Delete project error:', error)

        return reply.status(400).send({
          error:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
        })
      }
    }
  )
}

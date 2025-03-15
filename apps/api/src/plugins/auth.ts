import type { FastifyPluginAsync } from 'fastify'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      userId: string
    }
  }
}

export const authPlugin: FastifyPluginAsync = async app => {
  app.decorate(
    'authenticate',
    async (
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      request: { jwtVerify: () => any },
      reply: { send: (arg0: unknown) => void }
    ) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  )
}

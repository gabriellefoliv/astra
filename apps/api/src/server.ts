import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { loginRoute } from './routes/auth/login-route'
import { signUpRoute } from './routes/auth/sign-up-route'
import { createDatabaseRoute } from './routes/create-database-route'
import { deleteDatabaseRoute } from './routes/delete-database-route'
import { executeQueryRoute } from './routes/execute-query-route'
import { getDatabasesRoute } from './routes/get-databases-route'
import { createProjectRoute } from './routes/projects/create-project-route'
import { deleteProjectRoute } from './routes/projects/delete-project-route'
import { getProjectDetailsRoute } from './routes/projects/get-project-details'
import { getProjectsByUserRoute } from './routes/projects/get-projects-by-user-route'

interface JwtPayload {
  userId: string
  email: string
  name: string
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'defaultSecret',
})

app.register(signUpRoute)
app.register(loginRoute)

//

app.register(async protectedApp => {
  protectedApp.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify<JwtPayload>() // Tira o parâmetro token daqui!
      console.log('Usuário autenticado:', request.user)

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      console.error('Erro de autenticação:', err.message)
      return reply.status(401).send({ error: 'Não autorizado' })
    }
  })

  protectedApp.register(createDatabaseRoute)
  protectedApp.register(getDatabasesRoute)
  protectedApp.register(deleteDatabaseRoute)
  protectedApp.register(executeQueryRoute)

  protectedApp.register(createProjectRoute)
  protectedApp.register(getProjectsByUserRoute)
  protectedApp.register(getProjectDetailsRoute)
  protectedApp.register(deleteProjectRoute)
})

app.listen({ port: env.PORT }).then(() => {
  console.log('🚀 HTTP server running!')
})

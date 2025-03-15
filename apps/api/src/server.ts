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
import { getDatabasesRoute } from './routes/get-databases-route'
import { updateDatabaseRoute } from './routes/update-database-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: true,
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'defaultSecret',
})

app.register(signUpRoute)
app.register(loginRoute)

//

app.addHook('preHandler', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: 'Não autorizado' })
  }
})

//

app.register(createDatabaseRoute)
app.register(getDatabasesRoute)
app.register(updateDatabaseRoute)
app.register(deleteDatabaseRoute)

app.listen({ port: env.PORT }).then(() => {
  console.log('🚀 HTTP server running!')
})

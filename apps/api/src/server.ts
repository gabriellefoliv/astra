import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: true, // também permite qualquer frontend, porém dá pra limitar com string com a url do frontend
})

app.get('/api/hello', async (request, reply) => {
  return {
    message: 'Olá do Astra Database Service!',
    timestamp: new Date().toISOString(),
  }
})

const PORT = 3333

app.listen({ port: 3001 }).then(() => {
  console.log('HTTP server running!')
})

import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import prisma from '../../lib/prisma'

interface LoginParams {
  email: string
  password: string
}

export async function login(
  app: FastifyInstance,
  { email, password }: LoginParams
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = app.jwt.sign(
      { userId: user.id }, // Payload
      { expiresIn: '7d' }
    )

    return { token }
  } catch (error) {
    throw new Error('Login failed')
  }
}

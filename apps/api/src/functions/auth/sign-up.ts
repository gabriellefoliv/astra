import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'

interface SignUpParams {
  name: string
  email: string
  password: string
}

export async function signUp({ name, email, password }: SignUpParams) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return {
    userId: user.id,
  }
}

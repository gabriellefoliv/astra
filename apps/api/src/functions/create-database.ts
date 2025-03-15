import prisma from '../lib/prisma'

interface CreateDatabaseParams {
  name: string
  data: string
  userId: string
}

export async function createDatabase({
  name,
  data,
  userId,
}: CreateDatabaseParams) {
  const database = await prisma.database.create({
    data: {
      name,
      data,
      userId,
    },
  })

  return {
    databaseId: database.id,
  }
}

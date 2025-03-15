import prisma from '../lib/prisma'

interface UpdateDatabaseParams {
  userId: string
  id: string
  name: string
  data: string
}

export async function updateDatabase({
  userId,
  id,
  name,
  data,
}: UpdateDatabaseParams) {
  const database = await prisma.database.findUnique({
    where: { id },
  })

  if (!database || database.userId !== userId) {
    throw new Error('Database not found or unauthorized')
  }

  const updatedDatabase = await prisma.database.update({
    where: { id },
    data: { name, data },
  })

  return updatedDatabase
}

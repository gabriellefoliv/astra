import prisma from '../lib/prisma'

interface DeleteDatabaseParams {
  userId: string
  id: string
}

export async function deleteDatabase({ userId, id }: DeleteDatabaseParams) {
  const database = await prisma.database.findUnique({
    where: { id },
  })

  if (!database || database.userId !== userId) {
    throw new Error('Database not found or unauthorized')
  }

  await prisma.database.delete({
    where: { id },
  })
}

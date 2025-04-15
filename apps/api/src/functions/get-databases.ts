import prisma from '../lib/prisma'

interface GetDatabasesParams {
  userId: string
}

export async function getDatabases({ userId }: GetDatabasesParams) {
  const databases = await prisma.database.findMany({
    where: { userId },
  })

  return databases
}

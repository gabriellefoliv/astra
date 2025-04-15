import fs from 'node:fs'
import Database from 'better-sqlite3'
import prisma from '../lib/prisma'

interface ExecuteQueryParams {
  userId: string
  databaseId: string
  query: string
}

async function getDatabaseMetadata(databaseId: string) {
  return await prisma.database.findUnique({
    where: { id: databaseId },
  })
}

export async function executeQuery({
  userId,
  databaseId,
  query,
}: ExecuteQueryParams) {
  const metadata = await getDatabaseMetadata(databaseId)

  if (!metadata) {
    throw new Error('Database not found')
  }

  if (metadata.userId !== userId) {
    throw new Error('Unauthorized access to database')
  }

  const dbPath = metadata.path
  if (!fs.existsSync(dbPath)) {
    throw new Error('Database file does not exist')
  }

  const db = new Database(dbPath)

  try {
    const trimmed = query.trim().toLowerCase()
    const isSelect = trimmed.startsWith('select')

    if (isSelect) {
      const stmt = db.prepare(query)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const rows = stmt.all() as Record<string, any>[] // <-- Aqui está o cast necessário
      return { rows }
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      const result = db.exec(query)
      return { success: true, result }
    }
  } catch (err) {
    console.error(err)
    return { error: (err as Error).message }
  } finally {
    db.close()
  }
}

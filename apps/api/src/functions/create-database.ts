import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import prisma from '../lib/prisma'

interface CreateDatabaseParams {
  name: string
  userId: string
}

export async function createDatabase({ name, userId }: CreateDatabaseParams) {
  const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '')
  const dbDir = path.join(__dirname, '../../databases')
  const dbPath = path.join(dbDir, `${sanitizedName}.sqlite`)

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const existingDatabase = await prisma.database.findFirst({
    where: {
      name: sanitizedName,
      userId,
    },
  })

  if (existingDatabase) {
    throw new Error('Database with this name already exists')
  }

  // Cria o banco vazio com better-sqlite3
  const db = new Database(dbPath)

  // Fecha o banco logo após a criação
  db.close()

  const database = await prisma.database.create({
    data: {
      name: sanitizedName,
      path: dbPath,
      userId,
    },
  })

  return {
    databaseId: database.id,
  }
}

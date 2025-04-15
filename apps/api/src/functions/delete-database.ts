import fs from 'node:fs/promises'
import path from 'node:path'

export async function deleteDatabase({ userId, databaseId }: { userId: string, databaseId: string }) {
  const dbPath = path.resolve(__dirname, '../databases', userId, `${databaseId}.sqlite`)

  try {
    await fs.access(dbPath) // Verifica se o arquivo existe
    await fs.unlink(dbPath) // Deleta o arquivo
    return { success: true }
  } catch (error) {
    throw new Error('Database not found or could not be deleted')
  }
}

/*
  Warnings:

  - Added the required column `updatedAt` to the `Database` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Database" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Database_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Database" ("createdAt", "id", "name", "path", "user_id") SELECT "createdAt", "id", "name", "path", "user_id" FROM "Database";
DROP TABLE "Database";
ALTER TABLE "new_Database" RENAME TO "Database";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

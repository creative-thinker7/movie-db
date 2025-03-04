/*
  Warnings:

  - Added the required column `slug` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Movie" ("createdAt", "id", "image", "title", "updatedAt", "year") SELECT "createdAt", "id", "image", "title", "updatedAt", "year" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");
CREATE INDEX "Movie_slug_idx" ON "Movie"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

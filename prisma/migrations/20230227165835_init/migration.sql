-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'new note',
    "content" TEXT NOT NULL DEFAULT '',
    "parentId" INTEGER,
    CONSTRAINT "Note_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

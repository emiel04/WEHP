-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "pincode" TEXT,
    "isWehp" BOOLEAN NOT NULL DEFAULT false,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" DATETIME,
    "timeout" DATETIME
);
INSERT INTO "new_User" ("id", "isWehp", "name", "pincode") SELECT "id", "isWehp", "name", "pincode" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

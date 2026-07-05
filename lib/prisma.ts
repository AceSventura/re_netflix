import { PrismaClient } from "./generated/prisma";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// Il percorso è relativo alla root del processo Node in esecuzione
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" })

const prisma = new PrismaClient({ adapter })

export { prisma }
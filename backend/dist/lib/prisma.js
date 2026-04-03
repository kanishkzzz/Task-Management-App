"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const globalForPrisma = globalThis;
const Prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({ adapter });
exports.Prisma = Prisma;
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = Prisma;
}
//# sourceMappingURL=prisma.js.map
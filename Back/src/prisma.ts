import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Pega a URL do .env
const connectionString = process.env.DATABASE_URL as string;

// Inicializa o Pool de conexões do driver pg
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 💡 Passamos o adapter explicitamente para o construtor do Prisma 7
const prisma = new PrismaClient({ adapter });

export default prisma;
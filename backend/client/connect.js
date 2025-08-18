// client/connect.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

db.$connect().then(() => console.log("Database connected")).catch(console.error);

export default db;

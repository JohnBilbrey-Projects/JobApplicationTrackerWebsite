//load environment varibales from the server's new .env file
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

//retrieve the PostreSQL connection string from the environment
const connectionString = process.env.DATABASE_URL;

//prevent the server from starting without the database configuration it needs
if (!connectionString){
    throw new Error("DATABASE_URL is not defined.");
}

//configure Prisma's PostreSQL adapter using the database connection string
const adapter = new PrismaPg({
    connectionString,
});

//create a shared Prisma client that controllers can use to query the database
const prisma = new PrismaClient({
    adapter,
});

export default prisma;
import { Client } from "pg"
import dotenv from "dotenv"

dotenv.config()

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function test(){
    try {
        await client.connect()
        console.log("Connected to the database successfully!")
        client.end()
    } catch (error) {
        console.log("Error connecting to the database:", error)
    }
}

test()


import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {Pool} = pkg

const configDatabase = {
    connectionString: process.env.DATABASE_URL,
}

if (process.env.MODE === "prod") configDatabase.ssl = true;

export const dbConnection = new Pool(configDatabase);
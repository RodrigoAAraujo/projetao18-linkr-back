import { connection } from "../database/db.js";

export async function validateToken(token){
    try{
        const session = connection.query(`SELECT * FROM sessions WHERE token=$1`, [token])
        return session
    } catch(err){
        return res.status(500).send(err.message);
    }
};
import { connectionDB } from "../database/db.js";

export async function validateToken(token){

    try{
        const session = await connectionDB.query(`SELECT * FROM sessions WHERE token=$1`, [token])

        return session
    }catch(err){
        res.status(500).send(err.message);
        return
    }
}
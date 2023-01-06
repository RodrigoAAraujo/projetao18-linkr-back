import { connectionDB } from "../database/db.js";

export function validateToken(token){
    return connectionDB.query(`SELECT * FROM sessions WHERE token=$1`, [token])
}
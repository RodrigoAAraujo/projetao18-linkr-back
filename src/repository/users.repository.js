import { connectionDB } from "../database/db.js";

export function getUsersByName(name){
    const users = connectionDB.query(`SELECT id, username, image_url FROM users WHERE LOWER(username) LIKE LOWER($1)`, [`%${name}%`])

    return users
}
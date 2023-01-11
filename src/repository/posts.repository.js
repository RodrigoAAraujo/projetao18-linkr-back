import { connection } from "../database/db.js";

export async function getPostsByUserId(id){

    const user = await connection.query("SELECT username, image_url FROM users WHERE id=$1", [id])

    const posts = await connection.query("SELECT * FROM posts WHERE user_id =$1", [id])

    const body = {
        user:user.rows[0],
        posts: posts.rows
    }

    return body
}
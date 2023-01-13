import { connection } from "../database/db.js";

export async function getPostsByUserId(id){

    try{
        const user = await connection.query("SELECT username, image_url FROM users WHERE id=$1", [id])

        const posts = await connection.query("SELECT * FROM posts WHERE user_id =$1", [id])
    
        const body = {
            user:user.rows[0],
            posts: posts.rows
        }
    
        return body
    }catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }

    
}

export async function deletePostById(id){

    try{
        connection.query("DELETE FROM likes WHERE post_id=$1", [id])
        connection.query("DELETE FROM posts_hashtags WHERE post_id=$1", [id])
        connection.query("DELETE FROM posts WHERE id=$1", [id])

    }catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function updatePostById(id, comentary){

    try{
        connection.query("UPDATE posts SET comentary =$1 WHERE id=$2", [comentary, id])

    }catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}
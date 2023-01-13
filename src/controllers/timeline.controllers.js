import { connection } from "../database/db.js";
import urlMetadata from "url-metadata";
import joi from "joi";
import { insertHashtags } from "./hashtags.controller.js";


export async function postPosts(req, res){
    const post = req.body;
    console.log(post)
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const verificaToken = await connection.query("SELECT * FROM sessions WHERE token=$1;", [token]);
        const userId = verificaToken.rows[0].user_id;
        await connection.query('INSERT INTO posts (link, comentary, user_id) VALUES ($1, $2, $3);', [post.link, post.comentary, userId]);
        const selection = await connection.query(`SELECT * FROM posts WHERE user_id=$1;`, [userId]);
        const postId = selection.rows[selection.rows.length-1].id;
        console.log("post inserido");
        insertHashtags(post.comentary, postId);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error, "erro no try/catch de postPosts");
        res.sendStatus(500);
    }
};

export async function getPosts(req, res) {

    try {

        const posts = await connection.query('SELECT * FROM users JOIN posts ON posts.user_id = users.id ORDER BY created_at DESC');
        res.send(posts.rows)
        return
    
    } catch (error) {
        console.log(error, "erro no try/catch de getPosts");
        return res.sendStatus(500);
    }
}

export async function teste(req, res) {
    try {
        const query = connection.query('SELECT * FROM users WHERE id=1;');
        console.log(query.rows[0]);
        res.sendStatus(200);
        return;
    } catch (error) {
        console.log(error, "erro try/catch teste")
    }
}

import { connection } from "../database/db.js";
import urlMetadata from "url-metadata";
import joi from "joi";


export async function postPosts(req, res) {

    const post = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const userId = await connection.query("SELECT user_id FROM sessions WHERE token=$1", [token])
        await connection.query('INSERT INTO posts (link, comentary, user_id) VALUES ($1, $2, $3);', [post.link, post.commentary, userId.rows[0].user_id]);

        res.sendStatus(200);
        return

    } catch (error) {
        console.log(error, "erro no try/catch de postPosts");
        res.sendStatus(500)
    }


}

export async function getPosts(req, res) {


    let arrTimeline = [];
    let dadosLink;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    //const verificaToken = connection.query("SELECT * FROM sessions WHERE token=$1;", [token]);
    //if(verificaToken.rows.lenght === 0){console.log("token inválido ou nao encontrado") res.sendStatus(400) return};

    try {

        const posts = await connection.query('SELECT * FROM posts JOIN users ON posts.user_id = users.id LIMIT 20');
        res.send(posts.rows)
        return
    
    } catch (error) {
        console.log(error, "erro no try/catch de getPosts");
        res.sendStatus(500);
        return
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
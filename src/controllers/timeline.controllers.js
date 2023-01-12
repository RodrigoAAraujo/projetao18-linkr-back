import { connection } from "../database/db.js";
import urlMetadata from "url-metadata";
import joi from "joi";
import { insertHashtags } from "./hashtags.controller.js";

const postSchema = joi.object({
    link: joi.string().required().min(1),
    commentary: joi.string(),
});

export async function postPosts(req, res){
    const post = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const { error } = postSchema.validate(post, { abortEarly: false });
    if (error) {
        const errors = error.details.map((details) => details.message);
        console.log(errors, "postSchema inválido");
        return res.status(400).send(errors);
    };
    try {
        const verificaToken = await connection.query("SELECT * FROM sessions WHERE token=$1;", [token]);
        if(verificaToken.rowCount === 0){
            console.log("token inválido ou nao encontrado");
            return res.sendStatus(400);
        };
        console.log("token válido");
        const userId = verificaToken.rows[0].user_id;
        console.log(post.link, post.comentary)
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

export async function getPosts(req, res){
    let arrTimeline = [];
    let dadosLink;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    try {
        const verificaToken = await connection.query("SELECT * FROM sessions WHERE token=$1;", [token]);
        if(verificaToken.rows.length === 0){
            console.log("token inválido ou nao encontrado");
            return res.sendStatus(400);
        };
        const posts = await connection.query('SELECT * FROM posts LIMIT 20;');
        const postsReverse = posts.rows.reverse();
        for (let c = 0; c < postsReverse.length; c++) {
            console.log(postsReverse)
            const userId = postsReverse[c].user_id;
            const postId = postsReverse[c].id;
            const link = postsReverse[c].link;
            const comentary = postsReverse[c].description;
            const user = await connection.query('SELECT * FROM users WHERE id=$1;', [userId]);
            const imgUrl = user.rows[0].image_url;
            const name = user.rows[0].username;

            urlMetadata(link).then(
                function (metadata) {
                    dadosLink = metadata;
                    const newBody = {
                        id: postId,
                        name: name,
                        comentary: comentary,
                        img: imgUrl,
                        metadata: dadosLink
                    }
                    arrTimeline.push(newBody);
                    console.log(arrTimeline)
                    if (c === (postsReverse.length - 1)) {
                        return res.send(arrTimeline);
                    }
                },
                function (error) {
                    console.log(error);
                    return res.send(error);
                })
        }

    } catch (error) {
        console.log(error, "erro no try/catch de getPosts");
        return res.sendStatus(500);
    }
};
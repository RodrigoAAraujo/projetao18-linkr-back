import { connection } from "../database/db.js";
import urlMetadata from "url-metadata";
import joi from "joi";

const postSchema = joi.object({
    link: joi.string().required().min(1),
    description: joi.string(),
    token: joi.required()
});

export async function postPosts(req, res){
 
    const post = req.body;
    //const { authorization } = req.headers;
    //const token = authorization?.replace("Bearer ", "");

    const { error } = postSchema.validate(post, { abortEarly: false });
    if (error) {
        const errors = error.details.map((details) => details.message);
        console.log(errors, "postSchema inválido");
        res.status(400).send(errors);
        return;
    }

    //const verificaToken = connection.query("SELECT * FROM sessions WHERE token=$1;", [token]);
    //if(verificaToken.rows.lenght === 0){console.log("token inválido ou nao encontrado") res.sendStatus(400) return};
    //const userId = verificaToken.rows.[0].userId;

    try {
        console.log(post.link, post.description)
        await connection.query('INSERT INTO posts (link, description, "userId") VALUES ($1, $2, $3);', [post.link, post.description, 1]);
        console.log("post inserido")
        res.sendStatus(200);
        return

    } catch (error) {
        console.log(error, "erro no try/catch de postPosts");
        res.sendStatus(500)
    }


}

export async function getPosts(req, res) {

    console.log("começou")
    let arrTimeline = [];
    let dadosLink;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const verificaToken = await connection.query("SELECT * FROM sessions WHERE token=$1;", [token]);
    console.log(verificaToken)
    if(verificaToken.rows.length === 0){
        console.log("token inválido ou nao encontrado") 
        res.sendStatus(400) 
        return
    };

    try {

        const posts = await connection.query('SELECT * FROM posts LIMIT 20;');
        const postsReverse = posts.rows.reverse()

        for (let c = 0; c < postsReverse.length; c++) {

            const userId = postsReverse[c].userId;
            const link = postsReverse[c].link;
            const comentary = postsReverse[c].description;
            const user = await connection.query('SELECT * FROM users WHERE id=$1;', [userId]);
            const imgUrl = user.rows[0].image_url;
            const name = user.rows[0].username;

            urlMetadata(link).then(
                function (metadata) {

                    dadosLink = metadata;

                    const newBody = {
                        username: name,
                        comentary: comentary,
                        img: imgUrl,
                        metadata: dadosLink
                    }

                    arrTimeline.push(newBody);
                    console.log(posts.rows)
                    if (c === (postsReverse.length - 1)) {

                        res.send(arrTimeline);
                        return
                    }

                },
                function (error) {
                    console.log(error);
                    res.send(error);
                    return
                })


        }

    } catch (error) {
        console.log(error, "erro no try/catch de getPosts");
        res.sendStatus(500);
        return
    }
}

export async function teste(req, res){
    try {
        const query = connection.query('SELECT * FROM users WHERE id=1;');
        console.log(query.rows[0]);
        res.sendStatus(200);
        return;
    } catch (error) {
        console.log(error, "erro try/catch teste")
    }
}
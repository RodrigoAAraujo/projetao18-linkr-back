import { connectionDB } from "../database/db.js";
import urlMetadata from "url-metadata";
import joi from "joi";

const postSchema = joi.object({
    link: joi.string().required().min(1),
    description: joi.string(),
    token: joi.required()
});

export async function postPosts(req, res){
 
    const post = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const { error } = postSchema.validate(post, { abortEarly: false });
    if (error) {
        const errors = error.details.map((details) => details.message);
        console.log(errors, "postSchema inválido");
        res.status(400).send(errors);
        return;
    }

    //const verificaToken = connectionDB.query("SELECT * FROM sessions WHERE token=$1;", [token]);
    //if(verificaToken.rows.lenght === 0){console.log("token inválido ou nao encontrado") res.sendStatus(400) return};
    //const userId = verificaToken.rows.[0].userId;

    try {
        
        //await connectionDB.query('INSERT INTO posts (link, comentary, "userId") VALUES ($1, $2, $3);', [post.link, post.comentary, userId]);
        console.log("post inserido")
        res.sendStatus(200);
        return

    } catch (error) {
        console.log(error, "erro no try/catch de postPosts");
        res.sendStatus(500)
    }


}

export async function getPosts(req, res){


    let arrTimeline = [];
    let dadosLink;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    //const verificaToken = connectionDB.query("SELECT * FROM sessions WHERE token=$1;", [token]);
    //if(verificaToken.rows.lenght === 0){console.log("token inválido ou nao encontrado") res.sendStatus(400) return};

    try {
        
        const posts = await connectionDB.query('SELECT * FROM posts LIMIT 20');
        const postsReverse = posts.rows.reverse()
        for(let c = 0; c < postsReverse.length; c++){

            const userId = postsReverse[c].userId;
            const link = postsReverse[c].link;
            const comentary = postsReverse[c].comentary;
            const user = await connectionDB.query('SELECT * FROM users WHERE id=$1;', [userId]);
            const imgUrl = user.rows[0].image_url;
            const name = user.rows[0].username;

            urlMetadata(link).then(
                function (metadata) {
                    dadosLink = metadata;
                },
                function (error) {
                    console.log(error);
                    res.send(error);
                    return
                })

                const newBody = {
                    name: name,
                    comentary: comentary,
                    img: imgUrl,
                    metadata: dadosLink
                }

                arrTimeline.push(newBody);

                if(c === (postsReverse.lenght - 1)){
                    
                    res.send(arrTimeline);
                    return
                }

        }

    } catch (error) {
        console.log(error, "erro no try/catch de getPosts");
        res.sendStatus(500);
        return
    }
}

export async function teste(req, res){
    try {
        const query = connectionDB.query('SELECT * FROM users WHERE id=1;');
        console.log(query.rows[0]);
        res.sendStatus(200);
        return;
    } catch (error) {
        console.log(error, "erro try/catch teste")
    }
}
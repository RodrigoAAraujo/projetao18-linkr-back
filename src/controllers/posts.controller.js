import { connection } from "../database/db.js";
import urlMetadata from "url-metadata";
import { getPostsByUserId, deletePostById, updatePostById } from "../repository/posts.repository.js";

export async function likePost(req, res) {
    const { authorization } = req.headers;
    const postId = req.params.id;

    if (!authorization) {
        return res.sendStatus(401);
    }

    if (!postId) {
        return res.sendStatus(404);
    }

    try {
        const token = authorization?.replace("Bearer ", "")
        if (!token || token === "Bearer") {
            return res.sendStatus(401);
        }

        const session = await connection.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if (!session.rows[0]) {
            return res.sendStatus(401);
        };

        const userId = session.rows[0].user_id;

        await connection.query(`
        INSERT INTO likes (user_id, post_id) VALUES ($1, $2)
        `, [userId, postId])

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function removeLike(req, res) {
    const { authorization } = req.headers;
    const postId = req.params.id;

    if (!authorization) {
        return res.sendStatus(401);
    }

    if (!postId) {
        return res.sendStatus(404);
    }

    try {
        const token = authorization?.replace("Bearer ", "")
        if (!token || token === "Bearer") {
            return res.sendStatus(401);
        }
        

        const session = await connection.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if (!session.rows[0]) {
            return res.sendStatus(401);
        };

        const userId = session.rows[0].user_id;

        const infoLike = await connection.query(`
        SELECT * FROM likes WHERE user_id = $1 AND post_id = $2; 
        `, [userId, postId]);

        if (infoLike.rows.length === 0) {
            return res.sendStatus(404);
        }

        if (infoLike.rows[0].user_id !== userId) {
            return res.sendStatus(401);
        }

        await connection.query(`
            DELETE FROM likes WHERE user_id = $1 AND post_id = $2; 
        `, [userId, postId])

        return res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function verifyLike(req, res){
    const postId = req.params.id;
    const {authorization} = req.headers;

    if(!postId){
        return res.sendStatus(404);
    }

    try{
        const token = authorization?.replace("Bearer ", "")
        if(!token || token === "Bearer"){
            return res.sendStatus(401);
        }

        const session = await connection.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if(!session.rows[0]){
            return res.sendStatus(401);
        };

        const userId = session.rows[0].user_id;

        const postInfo = await connection.query(`
            SELECT user_id as "id", u.username
            FROM likes l
            JOIN users u ON l.user_id=u.id
            WHERE l.post_id = $1
        `, [postId])

        const userLike = await connection.query(`
            SELECT * FROM likes WHERE user_id = $1 AND post_id = $2
        `, [userId, postId]);

        let userLiked = false;

        if(userLike.rows.length === 1){
            userLiked = true;
        }

        return res.send({
            "userId": userId,
            "userLikedThisPost": userLiked,
            "likes": postInfo.rows
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}     

export async function sendMetaData(req, res) {
    const { link } = req.body

    try {
        urlMetadata(link).then(
            function (metadata) {
                res.send(metadata)
                return
            },
            function (error) {
                res.send(error)
                return
            })

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function addComment(req, res){
    const { authorization } = req.headers;
    const {postId, userId, comment} = req.body;

    if (!authorization) {
        return res.sendStatus(401);
    }

    if (!postId || !comment || !userId) {
        return res.sendStatus(404);
    }

    try{
        const token = authorization?.replace("Bearer ", "")
        if (!token || token === "Bearer") {
            return res.sendStatus(401);
        }

        const session = await connection.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if (!session.rows[0]) {
            return res.sendStatus(401);
        };

        console.log(session);

        if(session.rows[0].user_id !== userId){
            return res.sendStatus(401);
        }

        await connection.query(`
        INSERT INTO comments (user_id, comment, post_id)
        VALUES ($1, $2, $3)
        `, [userId, comment, postId])

        return res.sendStatus(201)

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function sendUserPosts(req, res){
    const {id} = req.params

    try{
        const userPosts = await getPostsByUserId(id)

        res.send(userPosts)
        return
    }catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function loadComments(req, res){
    const { authorization } = req.headers;
    const postId = req.params.id;

    if (!authorization) {
        return res.sendStatus(401);
    }

    if (!postId) {
        return res.sendStatus(404);
    }

    try{
        const token = authorization?.replace("Bearer ", "")
        if (!token || token === "Bearer") {
            return res.sendStatus(401);
        }

        const session = await connection.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if (!session.rows[0]) {
            return res.sendStatus(401);
        };

        const comments = await connection.query(`
            SELECT c.user_id, c.comment, u.id, u.username, u.image_url 
            FROM 
            comments c 
            JOIN 
            users u 
            ON c.user_id=u.id
            WHERE post_id=$1
        `, [postId])

        return res.send({
            "user_id" : `${session.rows[0].user_id}`,
            "comments": comments.rows
        })

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function deletePost(req, res){
    const {id} = req.params

    try{    
        await deletePostById(id)

        res.sendStatus(200)
        return

    }catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function updatePost(req, res){
    const {id} = req.params
    const {comentary} = req.body

    try{    
        await updatePostById(id, comentary)

        res.sendStatus(200)
        return

    }catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

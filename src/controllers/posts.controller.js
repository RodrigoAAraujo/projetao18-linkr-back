import { connectionDB } from "../database/db.js";
import urlMetadata from "url-metadata";

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

        const session = await connectionDB.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if (!session.rows[0]) {
            return res.sendStatus(401);
        };

        const userId = session.rows[0].user_id;

        await connectionDB.query(`
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

        const session = await connectionDB.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if (!session.rows[0]) {
            return res.sendStatus(401);
        };

        const userId = session.rows[0].user_id;

        const infoLike = await connectionDB.query(`
        SELECT * FROM likes WHERE user_id = $1 AND post_id = $2; 
        `, [userId, postId]);

        if (infoLike.rows.length === 0) {
            return res.sendStatus(404);
        }

        if (infoLike.rows[0].user_id !== userId) {
            return res.sendStatus(401);
        }

        await connectionDB.query(`
            DELETE FROM likes WHERE user_id = $1 AND post_id = $2; 
        `, [userId, postId])

        return res.sendStatus(204)
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

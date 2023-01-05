export async function likePost(req, res){
    const {authorization} = req.headers;

    if(!authorization){
        return res.sendStatus(401);
    }

    try{
        const token = authorization?.replace("Bearer ", "")
        if(!token || token === "Bearer"){
            return res.sendStatus(401);
        }

        const session = await connectionDB.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if(!session.rows[0]){
            return res.sendStatus(401);
        };

        return res.send()
    } catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function removeLike(req, res){
    const {authorization} = req.headers;

    if(!authorization){
        return res.sendStatus(401);
    }

    try{
        const token = authorization?.replace("Bearer ", "")
        if(!token || token === "Bearer"){
            return res.sendStatus(401);
        }

        const session = await connectionDB.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);

        if(!session.rows[0]){
            return res.sendStatus(401);
        };

        return res.send()
    } catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}
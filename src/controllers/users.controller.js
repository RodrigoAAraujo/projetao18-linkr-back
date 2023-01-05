import { getUsersByName } from "../repository/users.repository.js";


export async function likePost(req, res){
    const {authorization} = req.headers;

    if(!authorization){
        return res.sendStatus(401);
    }

    try{

    } catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function sendUsersNamesImages(req, res){
    const {name} = req.params

    try{
        const users = await getUsersByName(name)

        console.log(users)

        res.send(users.rows)
        return

    } catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}
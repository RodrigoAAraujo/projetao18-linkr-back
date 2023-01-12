import {validateToken} from "../repository/sessions.repository.js"

export default async function authValidation(req, res, next){
    const {authorization} = req.headers
    if(!authorization){
        return res.sendStatus(400);
    };
    if(!authorization.includes("Bearer ")){
        return res.sendStatus(400);
    };
    const token = authorization.replace("Bearer ", "");
    try{      
        const session = await validateToken(token)
        if(session.rowCount === 0){
            return res.sendStatus(404);
        }
        next()
    } catch(err){
        return res.status(500).send({message: err})
    }
};
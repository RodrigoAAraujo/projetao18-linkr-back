import {validateToken} from "../repository/sessions.repository.js"

export default async function authValidation(req, res, next){
    const {authorization} = req.headers

    console.log(authorization)

    if(!authorization){
        res.sendStatus(400)
        return
    }

    if(!authorization.includes("Bearer ")){
        res.sendStatus(400)
        return
    }

    const token = authorization.replace("Bearer ", "")

    try{      
        const session = await validateToken(token)

        if(session.rowCount === 0){
            res.sendStatus(404)
            return
        }

        next()

    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

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
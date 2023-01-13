import { connection } from "../database/db.js";

export async function insertHashtags(comentary, postId){
    const words = []
    if (comentary.includes(" ")) {
        words.push(...[comentary.split(" ")][0]);
    } else {
        words.push(comentary);
    }
    const withHash = words.filter(element => element.includes("#"));
    const withoutHash = withHash.map(element => element.slice(1));
    const hashtags = withoutHash.filter(element => element.match("^[a-zA-Z0-9]*$"));
    try {
        let hashtagId;
        for(let i=0; i<hashtags.length; i++){
            const selection = await connection.query(`SELECT * FROM hashtags WHERE name=$1;`, [hashtags[i]]);
            if(selection.rowCount===0){
                await connection.query('INSERT INTO hashtags (name) VALUES ($1);', [hashtags[i]]);
                const newSelection = await connection.query(`SELECT * FROM hashtags WHERE name=$1;`, [hashtags[i]]);
                hashtagId = newSelection.rows[0].id;
            } else{
                hashtagId = selection.rows[0].id;
            };
            await connection.query('INSERT INTO posts_hashtags (hashtag_id, post_id) VALUES ($1, $2);', [hashtagId, postId]);
        }
    } catch (error) {
        console.log(error);
    }
};

export async function selectTrendingHashtags(req, res){
    try {
        const result = await connection.query(
            'SELECT h.name, COUNT(p.id) AS "repetitions" FROM hashtags h JOIN posts_hashtags p ON h.id=p.hashtag_id GROUP BY h.name ORDER BY repetitions DESC;'
        );
        res.send(result.rows)
    } catch (error) {
        console.log(error);
        res.status(500).send(`${error.name}: ${error.message}`);
    }
};

export async function selectPostsWithHashtag(req, res){
    const {hashtag} = req.params;
    try {
        const result = await connection.query(`SELECT posts.*, users.username, users.image_url FROM posts JOIN posts_hashtags ON posts.id=posts_hashtags.post_id  JOIN hashtags ON hashtags.id=posts_hashtags.hashtag_id AND hashtags.name='${hashtag}' JOIN users ON posts.user_id = users.id ORDER BY created_at DESC;`);
        return res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(`${error.name}: ${error.message}`)
    }
};

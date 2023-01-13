import { connection } from "./database/db.js";

export async function Refresh(timeout){
    console.log("passando aqui")
    const timeNow = Date.now() - timeout
    let resp = []
    try {
        resp = await connection.query(`SELECT * FROM sessions WHERE created_at < $1`, [timeNow]);
    } catch (error) {
        return console.log(error)
    }

    if(resp.rowCount !== 0){
        resp.rows.map( async (session) => {
            try {
                connection.query(`DELETE FROM sessions WHERE id = $1`, [session.id])

                console.log("Session finished within user id: "+session.user_id)
            } catch (error) {
                console.log(error, "erro no try/catch de refresh")
            }
        })
    }
}

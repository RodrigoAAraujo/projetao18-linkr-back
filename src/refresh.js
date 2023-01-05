import { connectionDB } from "./database/db.js";

export async function Refresh(timeout){
    const timeNow = Date.now()
    let resp = []
    try {
        resp = await connectionDB.query(`SELECT * FROM sessions`);

    } catch (error) {
        return console.log(error)
    }

    resp.rows.map( async (session) => {
        const timeOnline = timeNow - session.created_at;
        if(timeOnline > timeout) {
          try {
            connectionDB.query(`DELETE FROM sessions WHERE token = $1`, [session.token])

            // console.log("Session finished within user id: "+session.user_id)
          } catch (error) {
              console.log(error)
          }
        }
    })
}
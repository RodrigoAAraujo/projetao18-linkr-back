import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

export async function create(req, res) {
  const { email, username, password, image_url } = res.locals.user;

  const hashedPass = bcrypt.hashSync(password, 10);

  try {
    await connectionDB.query(
      "INSERT INTO users (email, username, password, image_url ) VALUES ($1, $2, $3, $4)",
      [email, username, hashedPass, image_url]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function login(req, res) {
    const { password } = res.locals.user;
    const dbUser = res.locals.dbUser
  
    const compare = bcrypt.compareSync(password, dbUser.password);
  
    if(!compare){
      return res.status(401).send("wrong credentials")
    }
  
    const uniqueUID = uuidv4();
    
    try {
      await connectionDB.query(`
      INSERT INTO sessions
      ("token", "user_id", "created_at")
      VALUES ($1, $2, $3);
      `, [uniqueUID, dbUser.id, Date.now()])
  
      res.status(200).send({
        token: uniqueUID,
        username: dbUser.username, 
        image_url: dbUser.image_url
    })
    } catch (error) {
      res.status(500).send(error.message);
  }
}
  
  
export async function sessionRenew(req, res) {
    let session = res.locals.session
      try {
        await connectionDB.query(
            `UPDATE sessions
            SET created_at = $1
            WHERE token = $2;`,
            [Date.now(), session.id]
        );
    
      } catch (err) {
        res.status(500).send(err.message);
      }
}
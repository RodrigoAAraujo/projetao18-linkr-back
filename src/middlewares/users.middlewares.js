import { userLogSchemma, userRegSchemma } from "../models/User";

export async function validSchemaUser(req, res, next) {
    const user = req.body;
  
    const { error } = userRegSchemma.validate(user, { abortEarly: false });
  
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send({ errors });
    }

    //Check Username taken
    const userExists = await connectionDB.query(
        "SELECT * FROM users WHERE username=$1",
        [user.username]
    );
    
    if (userExists.rowCount !== 0) {
        return res.status(409).send("Username already in use.");
    }
  
    //Check Email taken
    const emailExists = await connectionDB.query(
        "SELECT * FROM users WHERE email=$1",
        [user.email]
    );
  
    if (emailExists.rowCount !== 0) {
        return res.status(409).send("This e-mail is already in use.");
    }
  
    res.locals.user = user;
  
    next();
}


export async function validLoginSchema(req, res, next) {
    const user = req.body;
  
    const { error } = userLogSchemma.validate(user, { abortEarly: false });
  
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send({ errors });
    }
    const userExists = await connectionDB.query(
      "SELECT * FROM users WHERE email=$1",
      [user.email]
    );
    if (userExists.rowCount === 0) {
      return res.status(400).send("This account doesn't exists");
    }
  
    res.locals.user = user;
    res.locals.dbUser = userExists.rows[0]
  
    next();
}
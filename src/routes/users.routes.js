import { Router } from "express";
import { create, login, sessionRenew } from "../controllers/users.controller";
import authValidation from "../middlewares/authValidation";
import { validLoginSchema, validSchemaUser } from "../middlewares/users.middlewares";

const router = Router()

router.post("/signup", validSchemaUser, create)
router.post("/signin", validLoginSchema, login)
router.post("/renew", authValidation, sessionRenew)
router.get("/users/:name", sendUsersNamesImages)

export default router
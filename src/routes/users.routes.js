import { Router } from "express";
import authValidation from "../middlewares/authValidation.js";
import { sendUsersNamesImages } from "../controllers/users.controller.js";
import { create, login, sessionRenew } from "../controllers/users.controller.js";
import { validLoginSchema, validSchemaUser } from "../middlewares/users.middlewares.js";

const router = Router()

router.post("/signup", validSchemaUser, create)
router.post("/signin", validLoginSchema, login)


router.post("/renew", authValidation,sessionRenew)
router.get("/users/:name",authValidation, sendUsersNamesImages)


export default router

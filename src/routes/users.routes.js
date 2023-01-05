import { Router } from "express";
import authValidation from "../middlewares/authValidation.js";
import { sendUsersNamesImages } from "../controllers/users.controller.js";

const router = Router()

router.use(authValidation)

router.get("/users/:name", sendUsersNamesImages)

export default router
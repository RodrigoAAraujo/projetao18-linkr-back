import { Router } from "express";
import authValidation from "../middlewares/authValidation";

const router = Router()

router.use(authValidation)

router.get("/users/:name", sendUsersNamesImages)
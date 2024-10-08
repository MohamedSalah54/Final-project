import express from "express";
import { protectRoute } from "../middleWare/protectRoute.js";
import { getMe ,signUp , login , logout} from "../controller/auth.controller.js";
const router = express.Router()

router.get("/getme",protectRoute,getMe)
router.post("/signup",signUp)
router.post("/login",login)
router.post("/logout",logout)

export default router;
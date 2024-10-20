import express from "express";
import { protectRoute } from "../middleWare/protectRoute.js";
import { register , login , logout} from "../controller/auth.controller.js";
const router = express.Router()

router.get("/getme",protectRoute,)
router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)

export default router;
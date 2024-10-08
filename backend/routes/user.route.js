import express from 'express';
import { protectRoute } from '../middleWare/protectRoute.js';
import {getUserProfile , getSuggestedUser , updateUser} from '../controller/user.controller.js'
const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested",protectRoute,getSuggestedUser)
router.post("/update",protectRoute,updateUser)



export default router;
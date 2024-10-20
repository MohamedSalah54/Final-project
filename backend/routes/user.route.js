import express from 'express';
import { protectRoute } from '../middleWare/protectRoute.js';
import {getUser , getUserFriends , addRemoveFriend} from '../controller/user.controller.js'
const router = express.Router();

router.get("/:id", protectRoute, getUser);
router.get("/:id/friends", protectRoute, getUserFriends);
router.patch("/:id/:friends", protectRoute, addRemoveFriend);



export default router;
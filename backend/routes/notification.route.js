import express from "express";
import { createNotification, getNotifications, markAsRead } from "../controller/notification.controller.js";
import { protectRoute } from "../middleWare/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, createNotification);
router.get("/:userId", protectRoute, getNotifications);
router.patch("/:id/read", protectRoute, markAsRead);

export default router;